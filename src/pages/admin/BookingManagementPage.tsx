import { useEffect, useState, useMemo } from 'react'
import {
    Layout,
    Menu,
    Table,
    Button,
    Modal,
    Form,
    Select,
    Input,
    DatePicker,
    Popconfirm,
    Card,
    Row,
    Col,
    Statistic
} from 'antd'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import type { AppDispatch, Store } from '../../stores'
import {
    fetchAllBookings,
    calculateStats,
    deleteBooking,
    createBooking,
    updateBooking
} from '../../slices/bookingSlice'
import type { BookingWithUser } from '../../slices/bookingSlice'
import { toast } from 'react-toastify'

const { Sider, Content } = Layout

const { Option } = Select

const BookingManagementPage = () => {
    const dispatch = useDispatch<AppDispatch>()

    const { allBookings, stats, loading } = useSelector((store: Store) => store.booking)
    const { data: courses } = useSelector((store: Store) => store.course)
    const [selectedKeys] = useState(['1'])
    const [form] = Form.useForm()
    const [modalVisible, setModalVisible] = useState(false)
    const [editingBooking, setEditingBooking] = useState<BookingWithUser | null>(null)

    // Filter states
    const [selectedClass, setSelectedClass] = useState<string>('all')
    const [searchEmail, setSearchEmail] = useState<string>('')
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            window.location.href = '/'
            return
        }
        dispatch(fetchAllBookings())
        dispatch(calculateStats())
    }, [dispatch, currentUser])

    // Filter bookings based on criteria
    const filteredBookings = useMemo(() => {
        return allBookings.filter(booking => {
            const classMatch = selectedClass === 'all' || booking.courseId === selectedClass
            const emailMatch = !searchEmail || booking.userEmail?.toLowerCase().includes(searchEmail.toLowerCase())
            const dateMatch = !selectedDate || booking.bookingDate === selectedDate.format('YYYY-MM-DD')

            return classMatch && emailMatch && dateMatch
        })
    }, [allBookings, selectedClass, searchEmail, selectedDate])

    const handleOpenModal = (record?: BookingWithUser) => {
        setEditingBooking(record || null)
        setModalVisible(true)
        if (record) {
            form.setFieldsValue({
                courseId: record.courseId,
                bookingDate: dayjs(record.bookingDate),
                bookingTime: dayjs(record.bookingTime, 'HH:mm'),
                userId: record.userId,
                userEmail: record.userEmail
            })
        } else {
            form.resetFields()
        }
    }

    const handleSubmit = async () => {
        const values = await form.validateFields()

        // Format time properly
        let formattedTime = values.bookingTime
        if (typeof values.bookingTime === 'string') {
            formattedTime = values.bookingTime
        } else if (values.bookingTime && typeof values.bookingTime.format === 'function') {
            formattedTime = values.bookingTime.format('HH:mm')
        }

        const payload = {
            userId: values.userId,
            courseId: values.courseId,
            bookingDate: values.bookingDate.format('YYYY-MM-DD'),
            bookingTime: formattedTime
        }

        try {
            if (editingBooking) {
                await dispatch(updateBooking({ id: editingBooking.id, data: payload }))
                toast.success('Cập nhật lịch thành công')
            } else {
                await dispatch(createBooking(payload))
                toast.success('Thêm lịch thành công')
            }

            // Refresh data to get updated user info
            await dispatch(fetchAllBookings())
            await dispatch(calculateStats())
            setModalVisible(false)
        } catch {
            toast.error('Có lỗi xảy ra')
        }
    }

    const handleDelete = async (id: string) => {
        await dispatch(deleteBooking(id))
        toast.success('Xóa lịch thành công')
        dispatch(fetchAllBookings())
        dispatch(calculateStats())
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser')
        localStorage.removeItem('role')
        window.location.href = '/'
    }

    // Dynamic chart data based on available courses
    const chartData = courses.map(course => ({
        name: course.name,
        'Số lượng lịch đặt': stats[course.type.toLowerCase()] || 0
    }))

    const columns = [
        {
            title: 'Lớp học',
            dataIndex: 'courseId',
            key: 'courseId',
        },
        {
            title: 'Ngày tập',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
        },
        {
            title: 'Khung giờ',
            dataIndex: 'bookingTime',
            key: 'bookingTime',
        },
        {
            title: 'Họ tên',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Email',
            dataIndex: 'userEmail',
            key: 'userEmail',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: unknown, record: BookingWithUser) => (
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
                                style: { color: 'white' }
                            },
                            {
                                key: '2',
                                label: 'Quản lý dịch vụ',
                                onClick: () => window.location.href = '/admin/courses',
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
                        {/* Statistics Section */}
                        <div>
                            <h2 style={{ marginBottom: '16px', padding: '24px 24px 0' }}>Thống kê lịch tập</h2>
                            <Row gutter={16} style={{ padding: '0 24px 24px' }}>
                                {courses.map(course => (
                                    <Col span={24 / courses.length} key={course.id}>
                                        <Card>
                                            <Statistic
                                                title={`Tổng số lịch ${course.name}`}
                                                value={stats[course.type.toLowerCase()] || 0}
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        {/* Chart Section */}
                        <div style={{
                            background: '#fff',
                            padding: '24px',
                            margin: '0 24px 24px'
                        }}>
                            <h3 style={{ marginBottom: '16px' }}>Biểu đồ thống kê lịch đặt</h3>
                            <BarChart width={800} height={300} data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Số lượng lịch đặt" fill="#1890ff" />
                            </BarChart>
                        </div>

                        {/* Filters Section */}
                        <div style={{
                            background: '#fff',
                            padding: '24px',
                            margin: '0 24px 24px'
                        }}>
                            <h3 style={{ marginBottom: '16px' }}>Bộ lọc</h3>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Lớp học:</label>
                                    <Select
                                        value={selectedClass}
                                        onChange={setSelectedClass}
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="all">Tất cả</Option>
                                        {courses.map(course => (
                                            <Option key={course.id} value={course.type}>
                                                {course.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col span={8}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Email:</label>
                                    <Input
                                        placeholder="Tìm theo email"
                                        value={searchEmail}
                                        onChange={(e) => setSearchEmail(e.target.value)}
                                    />
                                </Col>
                                <Col span={8}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Ngày:</label>
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        placeholder="mm/dd/yyyy"
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        format="MM/DD/YYYY"
                                    />
                                </Col>
                            </Row>
                        </div>

                        {/* Table Section */}
                        <div style={{ background: '#fff', padding: '24px', margin: '0 24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0 }}>Danh sách lịch đặt</h3>
                                <Button type="primary" onClick={() => handleOpenModal()}>
                                    Thêm lịch
                                </Button>
                            </div>
                            <Table
                                columns={columns}
                                dataSource={filteredBookings}
                                rowKey="id"
                                loading={loading}
                                pagination={{ pageSize: 5 }}
                            />
                        </div>

                        {/* Modal */}
                        <Modal
                            title={editingBooking ? 'Sửa lịch tập' : 'Thêm lịch mới'}
                            open={modalVisible}
                            onCancel={() => setModalVisible(false)}
                            onOk={handleSubmit}
                            okText={editingBooking ? 'Cập nhật' : 'Thêm'}
                            cancelText="Hủy"
                            width={600}
                        >
                            <Form form={form} layout="vertical">
                                <Form.Item
                                    label="Lớp học"
                                    name="courseId"
                                    rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}
                                >
                                    <Select placeholder="Chọn lớp học">
                                        {courses.map(course => (
                                            <Option key={course.id} value={course.type}>
                                                {course.name}
                                            </Option>
                                        ))}
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
                                    <Input placeholder="HH:mm (ví dụ: 09:00)" style={{ width: '100%' }} />
                                </Form.Item>
                                {!editingBooking && (
                                    <>
                                        <Form.Item
                                            label="User ID"
                                            name="userId"
                                            rules={[{ required: true, message: 'Vui lòng nhập User ID' }]}
                                        >
                                            <Input placeholder="Nhập User ID" />
                                        </Form.Item>
                                    </>
                                )}
                            </Form>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default BookingManagementPage

