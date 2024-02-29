import React, { useState, useEffect } from "react";


import axios from "axios";

import moment from "moment";
import { message, Table } from "antd";
import Layout from "../../components/Layout";
import { useSelector } from "react-redux";

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const { user } = useSelector(state => state.user)


    const getAppointments = async () => {
        try {
            const res = await axios.post("http://localhost:8080/api/doctor/doctor-appointments", { userId: user._id },
                {
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

    const handleStatus = async (record, status) => {
        try {
            const res = await axios.post(
                "http://localhost:8080/api/doctor/update-status",
                { appointmentsId: record._id, status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                message.success(res.data.message);
                getAppointments();
            }
        } catch (error) {
            console.log(error);
            message.error("Something Went Wrong");
        }
    };

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
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    {record.status === "pending" && (
                        <div className="d-flex">
                            <button
                                className="btn btn-success"
                                onClick={() => handleStatus(record, "approved")}
                            >
                                Approved
                            </button>
                            <button
                                className="btn btn-danger ms-2"
                                onClick={() => handleStatus(record, "reject")}
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            ),
        },
    ];
    return (
        <Layout>
            <h1>Appoinmtnets Lists</h1>
            <Table columns={columns} dataSource={appointments} />
        </Layout>
    );
};

export default DoctorAppointments
