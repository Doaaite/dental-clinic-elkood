import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Badge } from 'react-bootstrap';
import { useAppointment } from '../context/AppointmentContext';
import { 
  FaUser, FaPhone, FaTint, FaClipboardList, 
  FaCalendarAlt, FaSave, FaUserPlus 
} from 'react-icons/fa';

const AddAppointment = () => {
  const { addPatient, loading } = useAppointment();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodType: 'A+',
    type: 'upcoming',
    appointmentDate: ''
  });
  const [errors, setErrors] = useState({});

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const appointmentTypes = [
    { value: 'upcoming', label: '📅 حجز مسبق' },
    { value: 'direct', label: '🚶 مباشر' },
    { value: 'emergency', label: '🚨 حالة إسعافية' }
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'اسم المريض مطلوب (أكثر من حرفين)';
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'رقم الهاتف مطلوب (10 أرقام على الأقل)';
    }
    if (!formData.appointmentDate && formData.type === 'upcoming') {
      newErrors.appointmentDate = 'تاريخ الحجز مطلوب للحجوزات المسبقة';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await addPatient(formData);
    if (success) {
      setFormData({
        name: '',
        phone: '',
        bloodType: 'A+',
        type: 'upcoming',
        appointmentDate: ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Card className="glass-card form-card">
      <Card.Header className="card-header-gradient">
        <div className="d-flex align-items-center">
          <FaUserPlus className="header-icon" />
          <h5 className="mb-0">إضافة حجز جديد</h5>
        </div>
        <Badge bg="light" text="dark" className="required-badge">
          جميع الحقول مطلوبة
        </Badge>
      </Card.Header>
      
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <FaUser className="label-icon" />
                  اسم المريض
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل اسم المريض"
                  isInvalid={!!errors.name}
                  className="form-control-custom"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <FaPhone className="label-icon" />
                  رقم الهاتف
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="05XXXXXXXX"
                  isInvalid={!!errors.phone}
                  className="form-control-custom"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <FaTint className="label-icon" />
                  زمرة الدم
                </Form.Label>
                <Form.Select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="form-control-custom"
                >
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  <FaClipboardList className="label-icon" />
                  نوع الحجز
                </Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-control-custom"
                >
                  {appointmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {formData.type === 'upcoming' && (
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    <FaCalendarAlt className="label-icon" />
                    تاريخ الحجز
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    isInvalid={!!errors.appointmentDate}
                    className="form-control-custom"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.appointmentDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            )}

            <Col xs={12}>
              <Button 
                type="submit" 
                className="btn-save w-100"
                disabled={loading}
              >
                <FaSave className="me-2" />
                {loading ? 'جاري الحفظ...' : 'حفظ الحجز'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddAppointment;