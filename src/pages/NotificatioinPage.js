
import React from 'react'
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs, message } from 'antd'
import { hideLoading, showLoading } from '../redux/features/alertSlice'
import axios from 'axios'

const NotificatioinPage = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user)

    const handleMarkAllRead = async () => {
        try {
            dispatch(showLoading())
            const res = await axios.post('http://localhost:8080/api/get-all-notification', { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (res.data.success) {
                message.success(res.data.message)
                console.log("if" + res.data.message)
            } else {
                message.error(res.data.message)
                console.log("Else" + res.data.message)
            }


        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
            message.error('Something Went Wrong')
        }
    }


    const handleDeleteAllRead = async () => {
        try {
            dispatch(showLoading())
            const res = await axios.post('http://localhost:8080/api/delete-all-notification' , {userId:user._id},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if(res.data.success){
                message.success(res.data.message)
            }else{
                message.success(res.data.message)
            }
            

        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
            message.error('Something Went Wrong In delete Notification')
        }
    }
    return (
        <Layout>
            <h4 className='p-3 text-center'>Notificatioin Page</h4>
            <Tabs>
                <Tabs.TabPane tab='UnRead' key={0}>
                    <div className='d-flex justify-content-end'>
                        <h4 className='p-2 text-primary' onClick={handleMarkAllRead}>Mark All Read</h4>
                    </div>
                    {
                        user?.notification.map((notificationmsg) => (
                            <div className='card' onClick={notificationmsg.onClickPath} style={{ cursor: 'pointer' }}>
                                <div className='card-text'>{notificationmsg.message}</div>
                            </div>

                        ))
                    }
                </Tabs.TabPane>

                <Tabs.TabPane tab='Read' key={1}>
                    <div className='d-flex justify-content-end'>
                        <h4 className='p-2 text-primary' style={{cursor:'pointer'}} onClick={handleDeleteAllRead}>Delete All Read</h4>
                    </div>
                    {
                        user?.seennotification.map((notificationmsg) => (
                            <div className='card' onClick={notificationmsg.onClickPath} style={{ cursor: 'pointer' }}>
                                <div className='card-text'>{notificationmsg.message}</div>
                            </div>

                        ))
                    }
                </Tabs.TabPane>
            </Tabs>
        </Layout>
    )
}

export default NotificatioinPage
