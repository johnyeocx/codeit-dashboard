import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getReport } from '../../api/api';
import { Spin } from 'antd'
import moment from 'moment';


function Report() {
    const { reportId } = useParams();
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async function () {
            const res = await getReport(reportId)
            if (!res.data && !res.data.report) return
            let report = res.data.report
            report = report.split('\n')
            setData({
                ...res.data,
                report: report
            })
            setLoading(false)
        })()
    }, [])

    if (loading || !data) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
        }}>
            <Spin size="large" />
        </div>
    )
    console.log(data)
    return (
        <div style={{ padding: "30px 70px" }}>
            <h2 style={{ fontWeight: 'bold' }}>{`${data.repl}, ${data.assignment_name}`}</h2>
            <h4 style={{ fontWeight: 600 }}>{`Date: ${moment(data.submission_date).format("D MMM YY")}`}</h4>
            {data.report && data.report.map((line, index) => {
                if (index == data.report.length - 1) {
                    return (
                        <p style={{
                            fontSize: '13px',
                            marginBottom: 0,
                            fontWeight: 'bold'
                        }}>
                            <br></br>
                            {line}
                        </p>
                    )
                }
                else return (
                    <p style={{
                        fontSize: '13px', marginBottom: 0
                    }}>{line}</p>
                )
            })
            }
        </div>
    )
}

export default Report