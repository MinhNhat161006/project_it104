import React, { useEffect, useState } from 'react'
import {
    Table,
    Button,
    Modal,
    Form,
    Select,
    DatePicker,
    TimePicker,
    Popconfirm,
    message
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import dayjs from 'dayjs'
import type { AppDispatch, Store } from '../../stores'
import { createBooking, deleteBooking, fetchBookingsByUser, updateBooking, type BookingPayload } from '../../stores/slices/booking.slice'
import Header from '../../components/common/Header'
import { toast } from 'react-toastify'

const BookingPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { data, loading } = useSelector((store: Store) => store.booking)
    const userId = useSelector((store: Store) => store.user.data?.id)
    const currentUser = useSelector((store: Store) => store.user.data)


    const [form] = Form.useForm()
    const [modalVisible, setModalVisible] = useState(false)
    const [editingBooking, setEditingBooking] = useState<any>(null)

    useEffect(() => {
        if (userId) dispatch(fetchBookingsByUser(userId))
    }, [userId])

    const handleOpenModal = (record?: any) => {
        setEditingBooking(record || null)
        setModalVisible(true)
        if (record) {
            form.setFieldsValue({
                courseId: record.courseId,
                bookingDate: dayjs(record.bookingDate),
                bookingTime: dayjs(record.bookingTime, 'HH:mm')
            })
        } else {
            form.resetFields()
        }
    }

    const handleSubmit = async () => {
        const values = await form.validateFields()
        const payload = {
            userId: userId ?? '',
            courseId: values.courseId,
            bookingDate: values.bookingDate.format('YYYY-MM-DD'),
            bookingTime: values.bookingTime.format('HH:mm')
        }

        const isDuplicate = data.some(
            b =>
                b.userId === userId &&
                b.courseId === payload.courseId &&
                b.bookingDate === payload.bookingDate &&
                b.bookingTime === payload.bookingTime &&
                (!editingBooking || b.id !== editingBooking.id)
        )

        if (isDuplicate) {
            toast.warning('Lịch đã tồn tại, vui lòng chọn thời gian khác')
            return
        }

        if (editingBooking) {
            await dispatch(updateBooking({ id: editingBooking.id, data: payload }))
            toast.success('Cập nhật lịch thành công')
        } else {
            await dispatch(createBooking(payload))
            toast.success('Đặt lịch thành công')
        }

        setModalVisible(false)
    }

    const handleDelete = async (id: string) => {
        await dispatch(deleteBooking(id))
        toast.success('Xóa lịch thành công')
    }

    const columns = [
        {
            title: 'Lớp học',
            dataIndex: 'courseId'
        },
        {
            title: 'Ngày tập',
            dataIndex: 'bookingDate'
        },
        {
            title: 'Khung giờ',
            dataIndex: 'bookingTime'
        },
        {
            title: 'Họ tên',
            render: () => currentUser?.displayName || '—'
        },
        {
            title: 'Email',
            render: () => currentUser?.email || '—'
        },
        {
            title: 'Thao tác',
            render: (_: any, record: any) => (
                <>
                    <Button type="link" onClick={() => handleOpenModal(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa lịch này?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="link" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </>
            )
        }
    ]

    return (

        <>
            <style>
                {`
                    * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    }

                    html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    }
  `}
            </style>
            <Header />
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2>Quản lý lịch tập</h2>
                    <Button type="primary" onClick={() => handleOpenModal()}>
                        Đặt lịch mới
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                />

                <Modal
                    title={editingBooking ? 'Sửa lịch tập' : 'Đặt lịch mới'}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onOk={handleSubmit}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Lớp học"
                            name="courseId"
                            rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}
                        >
                            <Select placeholder="Chọn lớp học">
                                <Select.Option value="Yoga">Yoga</Select.Option>
                                <Select.Option value="Gym">Gym</Select.Option>
                                <Select.Option value="Zumba">Zumba</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Ngày tập"
                            name="bookingDate"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày tập' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="Khung giờ"
                            name="bookingTime"
                            rules={[{ required: true, message: 'Vui lòng chọn giờ tập' }]}
                        >
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    )
}


export default BookingPage
