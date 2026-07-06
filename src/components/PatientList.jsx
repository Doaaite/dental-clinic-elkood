import React from 'react';
import { Card, ListGroup, Button, Badge, Row, Col } from 'react-bootstrap';
import { useAppointment } from '../context/AppointmentContext';
import { FaUserMd, FaPhone, FaTint, FaTrashAlt, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const PatientList = ({ title, type, variant, bgGradient }) => {
  const { patients, moveToTreatment, cancelAppointment } = useAppointment();

  const filteredPatients = patients.filter(p => {
    if (type === 'upcoming') return p.status === 'upcoming';
    if (type === 'waiting') return p.status === 'waiting' || p.status === 'direct' || p.status === 'emergency';
    return false;
  });

  const getTypeLabel = (type) => {
    const types = {
      upcoming: '📅 مسبق',
      direct: '🚶 مباشر',
      emergency: '🚨 إسعافي'
    };
    return types[type] || type;
  };

  const getBloodTypeBadge = (type) => {
    const colors = {
      'A+': 'danger', 'A-': 'danger',
      'B+': 'warning', 'B-': 'warning',
      'AB+': 'success', 'AB-': 'success',
      'O+': 'info', 'O-': 'info'
    };
    return colors[type] || 'secondary';
  };

  return (
    <Card className={`glass-card patient-list-card ${bgGradient}`}>
      <Card.Header className="card-header-gradient">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">{title}</h5>
          <Badge className="patient-count-badge">
            {filteredPatients.length}
          </Badge>
        </div>
      </Card.Header>
      <Card.Body className="patient-list-body">
        {filteredPatients.length === 0 ? (
          <div className="empty-state text-center py-4">
            <p className="text-muted mb-0">لا يوجد مرضى</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {filteredPatients.map((patient, index) => (
              <ListGroup.Item 
                key={patient.id} 
                className="patient-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Row className="align-items-center">
                  <Col xs={12} md={7}>
                    <div className="patient-info">
                      <h6 className="patient-name">
                        <FaUserMd className="me-2" />
                        {patient.name}
                      </h6>
                      <div className="patient-details">
                        <small className="text-muted">
                          <FaPhone className="me-1" /> {patient.phone}
                        </small>
                        <small className="text-muted">
                          <FaTint className="me-1" /> 
                          <Badge bg={getBloodTypeBadge(patient.bloodType)} pill>
                            {patient.bloodType}
                          </Badge>
                        </small>
                        <small className="text-muted">
                          {getTypeLabel(patient.type)}
                        </small>
                      </div>
                      {patient.appointmentDate && (
                        <div className="appointment-time">
                          <small className="text-muted">
                            <FaCalendarAlt className="me-1" />
                            {format(new Date(patient.appointmentDate), 'dd MMM yyyy - HH:mm', { locale: ar })}
                          </small>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={5} className="mt-2 mt-md-0">
                    <div className="patient-actions">
                      {type === 'waiting' && (
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={() => moveToTreatment(patient.id)}
                          className="btn-action btn-treatment"
                        >
                          <FaArrowRight className="me-1" /> للعلاج
                        </Button>
                      )}
                      {type === 'upcoming' && (
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => cancelAppointment(patient.id)}
                          className="btn-action btn-cancel"
                        >
                          <FaTrashAlt className="me-1" /> إلغاء
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default PatientList;