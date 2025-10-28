import { useEffect, useState } from 'react'
import {
    Layout,
    Menu,
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, Store } from '../../stores'
import {
    fetchAllCourses,
    createCourse,
    updateCourse,
    deleteCourse
} from '../../slices/courseSlice'
import type { Course } from '../../slices/courseSlice'
import { calculateStats, fetchAllBookings, deleteBooking } from '../../slices/bookingSlice'
import { toast } from 'react-toastify'

const { Sider, Content } = Layout

const CourseManagementPage = () => {
    const dispatch = useDispatch<AppDispatch>()

    const { data: courses, loading } = useSelector((store: Store) => store.course)
    const { allBookings } = useSelector((store: Store) => store.booking)
    const [selectedKeys] = useState(['2'])
    const [form] = Form.useForm()
    const [modalVisible, setModalVisible] = useState(false)
    const [editingCourse, setEditingCourse] = useState<Course | null>(null)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            window.location.href = '/'
            return
        }
        dispatch(fetchAllCourses())
        dispatch(fetchAllBookings())
    }, [dispatch, currentUser])

    const handleOpenModal = (record?: Course) => {
        setEditingCourse(record || null)
        setModalVisible(true)
        if (record) {
            form.setFieldsValue({
                name: record.name,
                type: record.type,
                description: record.description,
                price: record.price,
                imageUrl: record.imageUrl
            })
        } else {
            form.resetFields()
        }
    }

    const handleSubmit = async () => {
        const values = await form.validateFields()
        const payload = {
            name: values.name,
            type: values.type,
            description: values.description,
            price: values.price,
            imageUrl: values.imageUrl
        }

        try {
            if (editingCourse) {
                await dispatch(updateCourse({ id: editingCourse.id, data: payload }))
                toast.success('Cập nhật dịch vụ thành công')
            } else {
                await dispatch(createCourse(payload))
                toast.success('Thêm dịch vụ thành công')
            }

            await dispatch(fetchAllCourses())
            await dispatch(calculateStats())
            setModalVisible(false)
        } catch {
            toast.error('Có lỗi xảy ra')
        }
    }

    const handleOpenDeleteModal = (course: Course) => {
        setCourseToDelete(course)
        setDeleteModalVisible(true)
    }

    const handleConfirmDelete = async () => {
        if (courseToDelete) {
            try {
                // Tìm tất cả bookings liên quan đến dịch vụ này
                const relatedBookings = allBookings.filter(
                    booking => booking.courseId === courseToDelete.type
                )

                // Xóa tất cả bookings liên quan
                if (relatedBookings.length > 0) {
                    await Promise.all(
                        relatedBookings.map(booking => dispatch(deleteBooking(booking.id)))
                    )
                }

                // Sau đó xóa dịch vụ
                await dispatch(deleteCourse(courseToDelete.id))

                // Cập nhật lại danh sách bookings và stats
                await dispatch(fetchAllBookings())
                await dispatch(calculateStats())

                toast.success(`Xóa dịch vụ "${courseToDelete.name}" và ${relatedBookings.length} lịch đặt liên quan thành công`)
                setDeleteModalVisible(false)
                setCourseToDelete(null)
            } catch {
                toast.error('Có lỗi xảy ra khi xóa dịch vụ')
            }
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser')
        localStorage.removeItem('role')
        window.location.href = '/'
    }

    const columns = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => price.toLocaleString('vi-VN')
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (url: string) => (
                <img src={url} alt="Course" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: unknown, record: Course) => (
                <>
                    <Button type="link" onClick={() => handleOpenModal(record)}>
                        Sửa
                    </Button>
                    <Button type="link" danger onClick={() => handleOpenDeleteModal(record)}>
                        Xóa
                    </Button>
                </>
            ),
        },
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
            
            .ant-menu-item {
                background-color: #1a2a3a !important;
            }
            
            .ant-menu-item-selected {
                background-color: #2a3a4a !important;
            }
            
            .ant-menu-item:hover {
                background-color: #2a3a4a !important;
            }
            
            .ant-layout-sider {
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                bottom: 0 !important;
                height: 100% !important;
                min-height: 100vh !important;
            }
            
            .ant-layout {
                min-height: 100vh !important;
            }
            
            .ant-layout-content {
                margin-left: 250px !important;
                min-height: 100vh !important;
            }
`}
            </style>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider width={250} style={{ backgroundColor: '#1a2a3a' }}>
                    <div style={{
                        padding: '20px',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold'
                    }}>
                        Admin Dashboard
                    </div>
                    <Menu
                        mode="inline"
                        selectedKeys={selectedKeys}
                        style={{ backgroundColor: '#1a2a3a', border: 'none' }}
                        items={[
                            {
                                key: '1',
                                label: 'Quản lý lịch',
                                style: { color: 'white' },
                                onClick: () => window.location.href = '/admin/bookings'
                            },
                            {
                                key: '2',
                                label: 'Quản lý dịch vụ',
                                style: { color: 'white' }
                            },
                            {
                                key: '3',
                                label: 'Quản lý người dùng',
                                onClick: () => window.location.href = '/admin/users',
                                style: { color: 'white' }
                            },
                            {
                                key: '4',
                                label: 'Trang chủ',
                                onClick: () => window.location.href = '/',
                                style: { color: 'white' }
                            },
                            {
                                key: '5',
                                label: 'Đăng xuất',
                                danger: true,
                                onClick: handleLogout
                            },
                        ]}
                    />
                </Sider>
                <Layout>

                    <Content style={{ background: '#f0f2f5', padding: 0, margin: 0 }}>
                        {/* Table Section */}
                        <div style={{ background: '#fff', padding: '24px', margin: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Quản lý Dịch vụ</h2>
                                <Button type="primary" onClick={() => handleOpenModal()}>
                                    Thêm dịch vụ mới
                                </Button>
                            </div>
                            <Table
                                columns={columns}
                                dataSource={courses}
                                rowKey="id"
                                loading={loading}
                                pagination={{ pageSize: 5 }}
                            />
                        </div>

                        {/* Modal */}
                        <Modal
                            title={editingCourse ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
                            open={modalVisible}
                            onCancel={() => setModalVisible(false)}
                            onOk={handleSubmit}
                            okText={editingCourse ? 'Cập nhật' : 'Thêm'}
                            cancelText="Hủy"
                            width={600}
                        >
                            <Form form={form} layout="vertical">
                                <Form.Item
                                    label="Tên dịch vụ"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
                                >
                                    <Input placeholder="Nhập tên dịch vụ" />
                                </Form.Item>
                                <Form.Item
                                    label="Loại"
                                    name="type"
                                    rules={[{ required: true, message: 'Vui lòng nhập loại dịch vụ' }]}
                                >
                                    <Input placeholder="Ví dụ: Gym, Yoga, Zumba" />
                                </Form.Item>
                                <Form.Item
                                    label="Mô tả"
                                    name="description"
                                    rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                                >
                                    <Input.TextArea rows={4} placeholder="Nhập mô tả dịch vụ" />
                                </Form.Item>
                                <Form.Item
                                    label="Giá (VNĐ)"
                                    name="price"
                                    rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        placeholder="Nhập giá dịch vụ"
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="URL Hình ảnh"
                                    name="imageUrl"
                                    rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
                                >
                                    <Input placeholder="Nhập đường dẫn hình ảnh (ví dụ: /assets/gym.jpg)" />
                                </Form.Item>
                            </Form>
                        </Modal>

                        {/* Delete Confirmation Modal */}
                        <Modal
                            title="Xác nhận xóa"
                            open={deleteModalVisible}
                            onCancel={() => setDeleteModalVisible(false)}
                            footer={[
                                <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
                                    Hủy
                                </Button>,
                                <Button key="delete" danger type="primary" onClick={handleConfirmDelete}>
                                    Xóa
                                </Button>,
                            ]}
                            width={450}
                        >
                            <div>
                                <p style={{ marginBottom: '12px' }}>
                                    <strong>Bạn có chắc chắn muốn xóa dịch vụ "{courseToDelete?.name}"?</strong>
                                </p>
                                {courseToDelete && (() => {
                                    const relatedBookingsCount = allBookings.filter(
                                        booking => booking.courseId === courseToDelete.type
                                    ).length;
                                    return relatedBookingsCount > 0 ? (
                                        <p style={{ color: '#ff4d4f', marginTop: '8px' }}>
                                            ⚠️ Cảnh báo: Có <strong>{relatedBookingsCount}</strong> lịch đặt liên quan sẽ bị xóa cùng!
                                        </p>
                                    ) : null;
                                })()}
                            </div>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default CourseManagementPage

