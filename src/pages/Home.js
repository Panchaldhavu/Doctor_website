import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import {Row} from 'antd'
import DoctorList from '../components/DoctorList'

const Home = () => {
  const [doctors, setDoctors] = useState()

  const getuserData = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/getAllDoctors',
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })


      if (res.data.success) {
        setDoctors(res.data.data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getuserData()
  }, []);
  return (
    <Layout>
      <h1 className='text-center'> Home Page</h1>
      <Row>
      {
        doctors && doctors.map(doctor=>(
          <DoctorList doctor={doctor}/>
        ))
      }

      </Row>
    </Layout>
  )
}

export default Home
