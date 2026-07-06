import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useAppointment } from '../context/AppointmentContext';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { FaUsers, FaCalendarCheck, FaClock, FaAmbulance } from 'react-icons/fa';

const StatisticsChart = () => {
  const { patients, currentPatient } = useAppointment();

  const stats = {
    total: patients.length,
    upcoming: patients.filter(p => p.status === 'upcoming').length,
    waiting: patients.filter(p => p.status === 'waiting' || p.status === 'direct' || p.status === 'emergency').length,
    emergency: patients.filter(p => p.type === 'emergency').length,
    inTreatment: currentPatient ? 1 : 0
  };

  const pieData = [
    { name: 'حجوزات مسبقة', value: stats.upcoming, color: '#667eea' },
    { name: 'في الانتظار', value: stats.waiting, color: '#f6d365' },
    { name: 'حالات إسعافية', value: stats.emergency, color: '#f5576c' },
  ];

  const barData = [
    { name: 'إجمالي', value: stats.total },
    { name: 'مسبق', value: stats.upcoming },
    { name: 'انتظار', value: stats.waiting },
    { name: 'إسعافي', value: stats.emergency },
  ];

  const statCards = [
    { 
      label: 'إجمالي المرضى', 
      value: stats.total, 
      icon: <FaUsers />, 
      color: '#667eea',
      bg: 'bg-purple'
    },
    { 
      label: 'حجوزات مسبقة', 
      value: stats.upcoming, 
      icon: <FaCalendarCheck />, 
      color: '#4facfe',
      bg: 'bg-blue'
    },
    { 
      label: 'في الانتظار', 
      value: stats.waiting, 
      icon: <FaClock />, 
      color: '#f6d365',
      bg: 'bg-yellow'
    },
    { 
      label: 'حالات إسعافية', 
      value: stats.emergency, 
      icon: <FaAmbulance />, 
      color: '#f5576c',
      bg: 'bg-red'
    }
  ];

  return (
    <Card className="glass-card chart-card">
      <Card.Header className="card-header-gradient">
        <h5 className="mb-0">📊 إحصائيات المرضى</h5>
      </Card.Header>
      <Card.Body>
        {/* بطاقات الإحصائيات الصغيرة */}
        <Row className="mb-3">
          {statCards.map((item, index) => (
            <Col xs={6} md={3} key={index}>
              <div className="stat-mini-card">
                <div className="stat-mini-icon" style={{ background: item.color }}>
                  {item.icon}
                </div>
                <div className="stat-mini-content">
                  <span className="stat-mini-value">{item.value}</span>
                  <span className="stat-mini-label">{item.label}</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* الرسوم البيانية */}
        <Row>
          <Col md={6}>
            <div className="chart-container">
              <h6 className="chart-title">توزيع المرضى</h6>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Col>
          <Col md={6}>
            <div className="chart-container">
              <h6 className="chart-title">عدد المرضى</h6>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#667eea" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>

        {currentPatient && (
          <div className="current-status mt-2">
            <Badge bg="success" className="w-100 py-2">
              🩺 مريض قيد العلاج: {currentPatient.name}
            </Badge>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default StatisticsChart;