import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import { Table } from 'antd'

const Users = () => {
    const [users, setUSers] = useState()
    const getUser = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/getAllUsers',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
       
            if(res.data.success){
                setUSers(res.data.data)
            }


        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        getUser()
    }, [])


    const columns = [
        {
          title: "Name",
          dataIndex: "name",
        },
        {
          title: "Email",
          dataIndex: "email",
        },
        {
          title: "Doctor",
          dataIndex: "isDoctor",
          render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
        },
      
      ];

    return (
        <Layout>
           <h1 className='text-center m-2'>Users List</h1>
           <Table columns={columns} dataSource={users} />
        </Layout>
    )
}

export default Users
