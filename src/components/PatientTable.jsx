import React, { useState } from 'react';
import { Card, Table, Badge, Button, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { useAppointment } from '../context/AppointmentContext';
import { 
  FaUserMd, FaPhone, FaTint, FaTrashAlt, 
  FaCalendarAlt, FaSearch, FaSort, FaSortUp, FaSortDown,
  FaEye, FaClock, FaTag
} from 'react-icons/fa';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const PatientTable = ({ title, type, variant }) => {
  const { patients, cancelAppointment, moveToTreatment } = useAppointment();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // تصفية المرضى حسب النوع
  const filteredPatients = patients.filter(p => {
    if (type === 'upcoming') return p.status === 'upcoming';
    if (type === 'waiting') return p.status === 'waiting' || p.status === 'direct' || p.status === 'emergency';
    return false;
  });

  // بحث
  const searchedPatients = filteredPatients.filter(p =>
    p.name.includes(searchTerm) ||
    p.phone.includes(searchTerm) ||
    p.bloodType.includes(searchTerm)
  );

  // ترتيب
  const sortedPatients = [...searchedPatients].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    if (sortField === 'appointmentDate') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    if (sortField === 'name') {
      aVal = aVal.toString();
      bVal = bVal.toString();
    }
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="sort-icon" />;
    return sortDirection === 'asc' ? 
      <FaSortUp className="sort-icon active" /> : 
      <FaSortDown className="sort-icon active" />;
  };

  const getTypeLabel = (type) => {
    const types = {
      upcoming: { label: 'مسبق', color: 'primary' },
      direct: { label: 'مباشر', color: 'warning' },
      emergency: { label: 'إسعافي', color: 'danger' }
    };
    return types[type] || { label: type, color: 'secondary' };
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

  const getStatusBadge = (status) => {
    const statuses = {
      upcoming: { label: 'قادم', color: 'primary' },
      waiting: { label: 'في الانتظار', color: 'warning' },
      'in-treatment': { label: 'قيد العلاج', color: 'success' },
      direct: { label: 'مباشر', color: 'warning' },
      emergency: { label: 'إسعافي', color: 'danger' }
    };
    return statuses[status] || { label: status, color: 'secondary' };
  };

  return (
    <Card className="glass-card patient-table-card">
      <Card.Header className="card-header-gradient">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
          <div className="d-flex align-items-center">
            <FaUserMd className="header-icon" />
            <h5 className="mb-0">{title}</h5>
            <Badge className="patient-count-badge ms-2">
              {sortedPatients.length}
            </Badge>
       
          </div>
          
               {/* شريط البحث */}
          <InputGroup className="search-input" style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="search-icon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="بحث عن مريض..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-control"
            />
          </InputGroup>
        </div>
      </Card.Header>
      
      <Card.Body className="p-0 table-wrapper">
        {sortedPatients.length === 0 ? (
          <div className="empty-state text-center py-5">
            <FaClock className="display-4 text-muted mb-3" />
            <p className="text-muted">لا يوجد مرضى</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="patient-table mb-0">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center gap-1">
                      المريض {getSortIcon('name')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('phone')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center gap-1">
                      الهاتف {getSortIcon('phone')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('bloodType')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center gap-1">
                      الزمرة {getSortIcon('bloodType')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center gap-1">
                      النوع {getSortIcon('type')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('appointmentDate')} style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center gap-1">
                      التاريخ {getSortIcon('appointmentDate')}
                    </div>
                  </th>
                  {/* <th>الحالة</th> */}
                  <th className="text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {sortedPatients.map((patient, index) => {
                  const typeInfo = getTypeLabel(patient.type);
                  const statusInfo = getStatusBadge(patient.status);
                  const bloodColor = getBloodTypeBadge(patient.bloodType);
                  
                  return (
                    <tr key={patient.id} className="patient-row">
                      <td>
                        <div className="patient-name-cell">
                          <FaUserMd className="patient-avatar-icon" />
                          <span className="fw-bold">{patient.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="patient-phone-cell">
                          <FaPhone className="text-muted me-1" />
                          {patient.phone}
                        </div>
                      </td>
                      <td>
                        <Badge bg={bloodColor} pill className="blood-badge">
                          {patient.bloodType}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={typeInfo.color} pill className="type-badge">
                          {typeInfo.label}
                        </Badge>
                      </td>
                      <td>
                        {patient.appointmentDate ? (
                          <div className="appointment-date">
                            <FaCalendarAlt className="text-muted me-1" />
                            <span>
                              {format(new Date(patient.appointmentDate), 'dd/MM/yyyy', { locale: ar })}
                            </span>
                            <small className="text-muted d-block">
                              {format(new Date(patient.appointmentDate), 'HH:mm', { locale: ar })}
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      {/* <td>
                        <Badge bg={statusInfo.color} className="status-badge">
                          <span className="status-dot"></span>
                          {statusInfo.label}
                        </Badge>
                      </td> */}
                      <td>
                        <div className="action-buttons">
                          {type === 'waiting' && (
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => moveToTreatment(patient.id)}
                              className="btn-treatment"
                              title="نقل للعلاج"
                            >
                              <FaEye className="me-1" /> للعلاج
                            </Button>
                          )}
                          {type === 'upcoming' && (
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => cancelAppointment(patient.id)}
                              className="btn-cancel"
                              title="إلغاء الحجز"
                            >
                              <FaTrashAlt className="me-1" /> إلغاء
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PatientTable;