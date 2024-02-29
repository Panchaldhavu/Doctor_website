import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table } from "antd";
import Layout from '../components/Layout'
import { useSelector } from "react-redux";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const {user} = useSelector(state => state.user)



    const getAppointments = async () => {
        try {
            const res = await axios.post("http://localhost:8080/api/user-appointments",{userId:user._id}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
       
            if (res.data.success) {
                setAppointments(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getAppointments();
    }, []);

    const columns = [
        {
            title: "ID",
            dataIndex: "_id",
        },
        {
            title: "Date & Time",
            dataIndex: "date",
            render: (text, record) => (
                <span>
                    {moment(record.date).format("DD-MM-YYYY")} &nbsp;
                    {moment(record.time).format("HH:mm")}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
        },
    ];
    return (
        <Layout>
            <h1 className='text-center'>Appointments List</h1>
            <Table columns={columns} dataSource={appointments} />
        </Layout>
    )
}

export default Appointments
