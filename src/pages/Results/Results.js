import React, { useEffect, useState } from 'react'
import { getStudentInfoRequest, getStudentResults } from '../../api/api'
import { Input, Table, Spin } from 'antd'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { AiOutlineEye } from 'react-icons/ai'
import "./Results.css"
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import logo from '../../CI LOGO.png'

function Results({ course, setCourse, setReport }) {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    const [resultsData, setResultsData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [studentInfoByReplName, setStudentInfoByReplName] = useState({});
    const [isByName, setIsByName] = useState(true)
    const [gradesByName, setGradesByName] = useState([])
    const [filteredGradesByName, setFilteredGradesByName] = useState([])
    // const [course, setCourse] = useState("essentials")

    const psetObjectRow = (pset) => {
        return {
            title: pset,
            dataIndex: pset,
            key: pset,
            render: (text) => <button onClick={() => {
                window.open(`report/${text._id}`, "_blank")
            }} className={text && parseInt(text.grade) < 60 ? "grade-text-failed" : "grade-text-passed"}>
                {`${text ? text.grade + "%" : ""}`}
            </button>
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'repl',
            key: 'repl',
            // sorter: {
            //     compare: (a, b) => studentInfoByReplName[a.repl].name
            //         < studentInfoByReplName[b.repl].name,
            // },
            render: (text) => (
                <>{studentInfoByReplName[text] ? studentInfoByReplName[text].name : text}</>
            )
        },
        {
            title: 'Assignment',
            dataIndex: 'assignment_name',
            key: 'assignment_name',
            sorter: {
                compare: (a, b) => a.assignment_name > b.assignment_name,
            },
        },
        {
            title: 'Mentor',
            dataIndex: 'repl',
            key: 'mentor',
            // sorter: {
            //     compare: (a, b) => studentInfoByReplName[a.repl].mentor
            //         < studentInfoByReplName[b.repl].mentor,
            // },
            render: (text) => (
                <>{studentInfoByReplName[text] ? studentInfoByReplName[text].mentor : "NIL"}</>
            )
        },
        {
            title: 'Submission Date',
            dataIndex: 'submission_date',
            key: 'submission_date',
            render: (text) => (
                <>{`${moment(text).format("DD MMM YY")}`}</>
            )
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            render: (text, row) => (
                <p className={row.passed ? "grade-text-passed" : "grade-text-failed"}>
                    {`${text}%`}
                </p>
            )
        },
        {
            title: 'Report',
            dataIndex: 'key',
            key: 'key',
            render: (text, row) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                        onClick={() => {
                            window.open(`report/${row._id}`, "_blank")
                        }}
                        className='report-button'
                    >
                        <HiOutlineDocumentReport className="report-icon" />
                    </button>
                    {/* <button className='delete-button'>
                        <MdDeleteOutline style={{ fontSize: '20px' }} />
                    </button> */}
                </div>

            )
        },
    ];

    const columns2 = [
        {
            title: 'Name',
            dataIndex: 'repl',
            key: 'name',
            render: (text) => (
                <>{studentInfoByReplName[text].name}</>
            )
        },
        {
            title: 'Mentor',
            dataIndex: 'repl',
            key: 'mentor',
            sorter: {
                compare: (a, b) => studentInfoByReplName[a.repl].mentor
                    < studentInfoByReplName[b.repl].mentor,
            },
            render: (text) => (
                <>{studentInfoByReplName[text].mentor}</>
            )
        },
        psetObjectRow('PSET 1'),
        psetObjectRow('PSET 2'),
        psetObjectRow('PSET 3'),
        psetObjectRow('PSET 4'),
        psetObjectRow('PSET 5'),
        psetObjectRow('PSET 6'),
    ]

    const sortByName = (results) => {
        let newGradesByName = []

        var curIndex = 0
        var prevName = ""
        while (curIndex < results.length) {
            if (results[curIndex].repl != prevName) {
                newGradesByName.push({ repl: results[curIndex].repl })
            }
            let length = newGradesByName.length

            let assignmentName = results[curIndex].assignment_name

            let grade = results[curIndex].grade
            newGradesByName[length - 1][assignmentName] = {
                grade,
                _id: results[curIndex]._id
            }

            var prevName = results[curIndex].repl
            curIndex += 1
        }
        console.log(newGradesByName);
        setGradesByName(newGradesByName)
        setFilteredGradesByName(newGradesByName)
    }

    const filterGradesByName = (e) => {
        setSearchValue(e.target.value);

        let filteredRes = [...gradesByName].filter(
            (result) => studentInfoByReplName[result.repl]
                .name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                studentInfoByReplName[result.repl]
                    .mentor.toLowerCase().includes(e.target.value.toLowerCase())
        )
        setFilteredGradesByName(filteredRes)
    }

    const searchInputChanged = (e) => {

        if (isByName) {
            filterGradesByName(e)
            return;
        }
        setSearchValue(e.target.value)
        let newFilteredData = [...resultsData]
        let filteredRes = [...resultsData].filter(
            (result) => studentInfoByReplName[result.repl]
                .name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                studentInfoByReplName[result.repl]
                    .mentor.toLowerCase().includes(e.target.value.toLowerCase())
        )
        newFilteredData = filteredRes
        setFilteredData(newFilteredData)
    }

    const getGrades = async () => {
        try {
            const res = await getStudentResults(course)
            if (!res.status == 200 && !res.data && !res.data.results) return
            return res.data.results
        } catch (error) {
            console.log('failed to get grades: ', error)
        }
    }

    const getStudentInfo = async () => {
        try {
            const res = await getStudentInfoRequest(course)
            if (!res.status == 200 && !res.data && !res.data.info) return

            const info = res.data.info

            const keys = info[0].map((key) => key.toLowerCase().trim())

            let newStudentInfo = {}
            for (let i = 1; i < info.length; i++) {

                let student = {}
                for (let j = 0; j < keys.length; j++) {
                    student[keys[j]] = info[i][j];
                }
                newStudentInfo[info[i][7]] = student;
            }
            setStudentInfoByReplName(newStudentInfo);
            return newStudentInfo
        } catch (error) {
            console.log('failed to get student info: ', error)
        }
    }

    useEffect(() => {
        if (course == null) {
            navigate('/')
            return
        }
        (async function () {
            const studentResults = await getGrades()
            let info = await getStudentInfo()
            let results = studentResults.filter((result) => info.hasOwnProperty(result.repl))
            setResultsData(results);
            setFilteredData(results);
            sortByName(results)
            setLoading(false)
        })()
    }, [course])

    if (loading) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
        }}>
            <Spin size="large" />
        </div>
    )

    return (
        <div className='main-container'>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} style={{ width: '20px', objectFit: 'contain', marginRight: '10px' }}></img>
                    <h2 style={{ margin: 0 }}>{course === "advanced" ? "CodeIT Advanced" : "CodeIT Essentials"}</h2>
                </div>
                <select className="course-select" defaultValue={course} onChangeCapture={(e) => {
                    localStorage.setItem('current_course', e.target.value)
                    setCourse(e.target.value)
                }}>
                    <option value="essentials">CodeIT Essentials</option>
                    <option value="advanced">CodeIT Advanced</option>
                </select>
            </div>
            <div style={{
                width: '100%'
            }}>
                <div>

                    <div className="course-container">
                        <div style={{
                            padding: '15px', display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '60%', }}>
                                <p style={{ margin: 0, marginRight: 10 }}>Search Name: </p>
                                <Input
                                    style={{ width: '60%' }}
                                    value={searchValue}
                                    onChange={(e) => searchInputChanged(e)}
                                />
                            </div>

                            <button onClick={() => setIsByName(!isByName)}>
                                <AiOutlineEye style={{ "fontSize": "20px" }} />
                            </button>
                        </div>
                        {!isByName ? (
                            <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                                <Table
                                    id="results-table"
                                    columns={columns}
                                    dataSource={[...filteredData]}
                                    pagination={false}
                                    rowKey="_id"
                                />

                            </div>
                        ) :
                            (
                                <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                                    <Table
                                        id="results-table"
                                        columns={columns2}
                                        dataSource={[...filteredGradesByName]}
                                        pagination={false}
                                        rowKey="repl"
                                    />

                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Results