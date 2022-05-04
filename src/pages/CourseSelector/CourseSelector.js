import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./CourseSelector.css"

function CourseSelector({ setCourse }) {
    const navigate = useNavigate()

    const redirectTo = (course) => {
        setCourse(course)
        navigate('/course-info')
    }

    return (
        <div style={{ width: '100%', height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 'bold', fontFamily: 'Avenir' }}>Select a Course</h2>

            <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                <button className='select-button' onClick={() => redirectTo('essentials')}>
                    <h3>CodeIT Essentials</h3>
                </button>
                <button className='select-button' onClick={() => redirectTo('advanced')}>
                    <h3>CodeIT Advanced</h3>
                </button>
            </div>

        </div>
    )
}

export default CourseSelector