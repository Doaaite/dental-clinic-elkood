import React from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { useAppointment } from '../context/AppointmentContext';
import { FaUserMd, FaPhone, FaTint, FaCheckCircle, FaClock } from 'react-icons/fa';

const CurrentPatient = () => {
  const { currentPatient, finishTreatment } = useAppointment();

  const getBloodTypeBadge = (type) => {
    const colors = {
      'A+': 'danger', 'A-': 'danger',
      'B+': 'warning', 'B-': 'warning',
      'AB+': 'success', 'AB-': 'success',
      'O+': 'info', 'O-': 'info'
    };
    return colors[type] || 'secondary';
  };

  if (!currentPatient) {
    return (
      <Card className="glass-card current-patient-card">
        <Card.Header className="card-header-gradient">
          <h5 className="mb-0">👨‍⚕️ المريض الحالي</h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <div className="empty-state">
            <FaClock className="display-4 text-muted mb-3" />
            <p className="text-muted">لا يوجد مريض قيد العلاج حالياً</p>
            <small className="text-muted">اختر مريضاً من قائمة الانتظار</small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="glass-card current-patient-card active-patient">
      <Card.Header className="card-header-gradient success-gradient">
        <h5 className="mb-0">👨‍⚕️ المريض الحالي</h5>
        <Badge bg="success" className="status-badge">
          🟢 قيد العلاج
        </Badge>
      </Card.Header>
      <Card.Body>
        <div className="current-patient-info">
          <div className="patient-avatar">
            <FaUserMd className="avatar-icon" />
          </div>
          <h4 className="patient-name-display">{currentPatient.name}</h4>
          
          <Row className="mt-3">
            <Col xs={6}>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <span>{currentPatient.phone}</span>
              </div>
            </Col>
            <Col xs={6}>
              <div className="info-item">
                <FaTint className="info-icon" />
                <Badge bg={getBloodTypeBadge(currentPatient.bloodType)} pill>
                  {currentPatient.bloodType}
                </Badge>
              </div>
            </Col>
          </Row>

          <Button 
            variant="success" 
            className="btn-finish w-100 mt-3"
            onClick={finishTreatment}
          >
            <FaCheckCircle className="me-2" />
            إنهاء العلاج
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CurrentPatient;