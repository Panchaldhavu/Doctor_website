import React from 'react'
import { Form, Input, message } from 'antd'
import '../styles/Register.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/features/alertSlice'

const Register = () => {
const navigate = useNavigate()
const dispatch = useDispatch()

    const submit = async (values) => {
        try {
             dispatch(showLoading())
            const res = await axios.post(' http://localhost:8080/api/register' , values)
            dispatch(hideLoading())
            if(res.data.success){
                message.success("Register Successfully!")
                navigate('/login')
            }else{
                message.error(res.data.message)
            }

            
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
            message.error('Something Went Wrong')
        }
    }
    return (
        <div className='form-container'>
            <Form layout='vertical' onFinish={submit} className='register-form'>
            <h3 className='text-center'>Register Form</h3>
                <Form.Item label="Name" name="name">
                    <Input type='text' required />
                </Form.Item>

                <Form.Item label="Email" name="email">
                    <Input type='email' required />
                </Form.Item>

                <Form.Item label="Password" name="password">
                    <Input type='password' required />
                </Form.Item>

                <Link to='/login' className='m-2'> Already User login here</Link>

                <button type='submit' className='btn btn-primary'> 
                    Register
                </button>

            </Form>

        </div>
    )
}

export default Register
