import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppointmentProvider } from './context/AppointmentContext';
import Navbar from './components/Navbar';
import AddAppointment from './components/AddAppointment';
import StatisticsChart from './components/StatisticsChart';
import PatientList from './components/PatientList';
import CurrentPatient from './components/CurrentPatient';
import './styles/theme.css';
import './styles/components.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientTable from './components/PatientTable';  // ✅ استيراد الجديد


function App() {
  return (
    <AppointmentProvider>
      <div className="app-wrapper">
        <Navbar />
        <Container fluid className="main-container py-4">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
    
          {/* الصف الأول: فورم + إحصائيات بيانية */}
          <Row className="mb-4">
            <Col lg={6} className="mb-3 mb-lg-0">
              <AddAppointment />
            </Col>
            <Col lg={6}>
              <StatisticsChart />
            </Col>
          </Row>

          {/* الصف الثاني: المرضى القادمون + المرضى في الانتظار */}
          <Row className="mb-4">
            <Col lg={7} className="mb-3 mb-lg-0">
              {/* <PatientList 
                title="📋 المرضى القادمون" 
                type="upcoming"
                variant="primary"
                bgGradient="gradient-blue"
              /> */}
               <PatientTable 
                title="📋 المرضى القادمون" 
                type="upcoming"
              />
            </Col>
            <Col lg={5}>
              <PatientList 
                title="⏳ المرضى في الانتظار" 
                type="waiting"
                variant="warning"
                bgGradient="gradient-orange"
              />
            </Col>
          </Row>

          {/* الصف الثالث: المريض الحالي */}
          <Row>
            <Col xs={12}>
              <CurrentPatient />
            </Col>
          </Row>
        </Container>
      </div>
    </AppointmentProvider>
  );
}

export default App;