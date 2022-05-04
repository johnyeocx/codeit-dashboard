import { useState } from 'react';
import './App.css';
import Results from './pages/Results/Results';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Report from './pages/Report/Report';
import 'antd/dist/antd.css';
import CourseSelector from './pages/CourseSelector/CourseSelector';

const getCurrentCourse = () => {

  let current = localStorage.getItem('current_course')
  if (current) {
    return current
  } else {
    return "advanced"
  }
}
function App() {
  const [report, setReport] = useState(null);
  const [course, setCourse] = useState(getCurrentCourse())
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<CourseSelector setCourse={setCourse} />} /> */}
        <Route path='/' element={<Results course={course} setReport={setReport} setCourse={setCourse} />} />
        <Route path='/report/:reportId' element={<Report report={report} setReport={setReport} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
