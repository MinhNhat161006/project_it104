import { useEffect, useState, useMemo } from 'react'
import {
    Layout,
    Menu,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Tag
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, Store } from '../../stores'
import {
    fetchAllUsers,
    createUserThunk,
    updateUserThunk,
    deleteUserThunk
} from '../../slices/userSlice'
import type { User } from '../../slices/userSlice'
import { fetchAllBookings } from '../../slices/bookingSlice'
import { toast } from 'react-toastify'

const { Sider, Content } = Layout

const UserManagementPage = () => {
    const dispatch = useDispatch<AppDispatch>()

    const { allUsers, loading } = useSelector((store: Store) => store.user)
    const { allBookings } = useSelector((store: Store) => store.booking)
    const [selectedKeys] = useState(['3'])
    const [form] = Form.useForm()
    const [modalVisible, setModalVisible] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            window.location.href = '/'
            return
        }
        dispatch(fetchAllUsers())
        dispatch(fetchAllBookings())
    }, [dispatch, currentUser])

    // Calculate booking count per user
    const userBookingCounts = useMemo(() => {
        const counts: { [key: string]: number } = {}
        allBookings.forEach(booking => {
            counts[booking.userId] = (counts[booking.userId] || 0) + 1
        })
        return counts
    }, [allBookings])

    const handleOpenModal = (record?: User) => {
        setEditingUser(record || null)
        setModalVisible(true)
        if (record) {
            form.setFieldsValue({
                fullName: record.fullName,
                email: record.email,
                phone: record.phone,
                password: '' // Don't show password
            })
        } else {
            form.resetFields()
        }
    }

    const handleSubmit = async () => {
        const values = await form.validateFields()
        const payload = {
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            password: values.password
        }

        try {
            if (editingUser) {
                // If password is empty, don't update it
                const updateData: Partial<User> = {
                    fullName: values.fullName,
                    email: values.email,
                    phone: values.phone
                }
                if (values.password) {
                    updateData.password = values.password
                }
                await dispatch(updateUserThunk({ id: editingUser.id, data: updateData }))
                toast.success('Cập nhật người dùng thành công')
            } else {
                await dispatch(createUserThunk(payload))
                toast.success('Thêm người dùng thành công')
            }
            setModalVisible(false)
            form.resetFields()
        } catch {
            toast.error('Có lỗi xảy ra')
        }
    }

    const handleOpenDeleteModal = (record: User) => {
        // Prevent deleting current admin
        if (record.id === currentUser.id) {
            toast.error('Không thể xóa tài khoản hiện tại')
            return
        }
        setUserToDelete(record)
        setDeleteModalVisible(true)
    }

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            try {
                await dispatch(deleteUserThunk(userToDelete.id))
                toast.success('Xóa người dùng thành công')
                setDeleteModalVisible(false)
                setUserToDelete(null)
            } catch {
                toast.error('Có lỗi xảy ra')
            }
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser')
        window.location.href = '/sign-in'
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag color={role === 'admin' ? 'red' : 'blue'}>
                    {role === 'admin' ? 'Admin' : 'User'}
                </Tag>
            )
        },
        {
            title: 'Số lịch đã đặt',
            key: 'bookingCount',
            render: (_: unknown, record: User) => userBookingCounts[record.id] || 0
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: unknown, record: User) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        onClick={() => handleOpenModal(record)}
                        disabled={record.id === currentUser.id && record.role === 'admin'}
                    >
                        Sửa
                    </Button>
                    <Button
                        danger
                        onClick={() => handleOpenDeleteModal(record)}
                        disabled={record.id === currentUser.id}
                    >
                        Xóa
                    </Button>
                </div>
            )
        }
    ]

    return (
        <>
            <style>{`
                .ant-layout-sider {
                    position: fixed !important;
                    left: 0 !important;
                    top: 0 !important;
                    bottom: 0 !important;
                    height: 100% !important;
                    min-height: 100vh !important;
                }
                .ant-layout-content {
                    margin-left: 250px !important;
                    min-height: 100vh !important;
                }
            `}</style>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider width={250} style={{ backgroundColor: '#1a2a3a' }}>
                    <div
                        style={{
                            color: 'white',
                            padding: '24px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            borderBottom: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
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
                                onClick: () => (window.location.href = '/admin/bookings'),
                                style: { color: 'white' }
                            },
                            {
                                key: '2',
                                label: 'Quản lý dịch vụ',
                                onClick: () => (window.location.href = '/admin/courses'),
                                style: { color: 'white' }
                            },
                            {
                                key: '3',
                                label: 'Quản lý người dùng',
                                style: { color: 'white' }
                            },
                            {
                                key: '4',
                                label: 'Trang chủ',
                                onClick: () => (window.location.href = '/'),
                                style: { color: 'white' }
                            },
                            {
                                key: '5',
                                label: 'Đăng xuất',
                                danger: true,
                                onClick: handleLogout
                            }
                        ]}
                    />
                </Sider>
                <Layout>
                    <Content style={{ background: '#f0f2f5', padding: 0, margin: 0 }}>
                        {/* Header Section */}
                        <div
                            style={{
                                background: '#fff',
                                padding: '24px',
                                margin: '0 24px 24px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <h2 style={{ margin: 0 }}>Quản lý người dùng</h2>
                            <Button type="primary" onClick={() => handleOpenModal()}>
                                Thêm người dùng
                            </Button>
                        </div>

                        {/* Table Section */}
                        <div style={{ background: '#fff', padding: '24px', margin: '0 24px' }}>
                            <Table
                                columns={columns}
                                dataSource={allUsers}
                                rowKey="id"
                                loading={loading}
                                pagination={{ pageSize: 10 }}
                            />
                        </div>

                        {/* Add/Edit Modal */}
                        <Modal
                            title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}
                            open={modalVisible}
                            onCancel={() => {
                                setModalVisible(false)
                                form.resetFields()
                            }}
                            onOk={handleSubmit}
                            okText={editingUser ? 'Cập nhật' : 'Thêm'}
                            cancelText="Hủy"
                            width={500}
                        >
                            <Form form={form} layout="vertical">
                                <Form.Item
                                    label="Họ và tên"
                                    name="fullName"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                                >
                                    <Input placeholder="Nhập họ và tên" />
                                </Form.Item>

                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email' },
                                        { type: 'email', message: 'Email không hợp lệ' }
                                    ]}
                                >
                                    <Input placeholder="Nhập email" />
                                </Form.Item>

                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                >
                                    <Input placeholder="Nhập số điện thoại" />
                                </Form.Item>

                                <Form.Item
                                    label="Mật khẩu"
                                    name="password"
                                    rules={editingUser ? [] : [{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                                >
                                    <Input.Password
                                        placeholder={editingUser ? 'Để trống nếu không đổi mật khẩu' : 'Nhập mật khẩu'}
                                    />
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
                                </Button>
                            ]}
                            width={400}
                        >
                            <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default UserManagementPage

