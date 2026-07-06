import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const AppointmentContext = createContext();

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  // تحميل البيانات من localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('dentalClinicData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setPatients(parsed.patients || []);
      setCurrentPatient(parsed.currentPatient || null);
    } else {
      // بيانات تجريبية
      const demoData = {
        patients: [
          {
            id: uuidv4(),
            name: 'أحمد محمد',
            phone: '0555123456',
            bloodType: 'A+',
            type: 'upcoming',
            appointmentDate: '2026-07-10T10:00',
            status: 'upcoming'
          },
          {
            id: uuidv4(),
            name: 'سارة خالد',
            phone: '0555234567',
            bloodType: 'O-',
            type: 'direct',
            appointmentDate: '2026-07-05T11:30',
            status: 'waiting'
          },
          {
            id: uuidv4(),
            name: 'محمد علي',
            phone: '0555345678',
            bloodType: 'B+',
            type: 'emergency',
            appointmentDate: '2026-07-05T09:00',
            status: 'waiting'
          },
          {
            id: uuidv4(),
            name: 'نورا حسن',
            phone: '0555456789',
            bloodType: 'AB+',
            type: 'upcoming',
            appointmentDate: '2026-07-12T14:30',
            status: 'upcoming'
          }
        ],
        currentPatient: null
      };
      setPatients(demoData.patients);
      setCurrentPatient(demoData.currentPatient);
      localStorage.setItem('dentalClinicData', JSON.stringify(demoData));
    }
  }, []);

  // حفظ البيانات
  const saveData = (newPatients, newCurrentPatient) => {
    const data = {
      patients: newPatients,
      currentPatient: newCurrentPatient
    };
    localStorage.setItem('dentalClinicData', JSON.stringify(data));
  };

  // إضافة مريض جديد
  const addPatient = (patientData) => {
    setLoading(true);
    try {
      const newPatient = {
        id: uuidv4(),
        ...patientData,
        status: patientData.type === 'upcoming' ? 'upcoming' : 'waiting'
      };

      // التحقق من صحة البيانات
      if (!patientData.name || patientData.name.trim().length < 2) {
        toast.error('❌ اسم المريض يجب أن يكون أكثر من حرفين');
        setLoading(false);
        return false;
      }

      if (!patientData.phone || patientData.phone.length < 10) {
        toast.error('❌ رقم الهاتف غير صحيح');
        setLoading(false);
        return false;
      }

      const updatedPatients = [...patients, newPatient];
      setPatients(updatedPatients);
      saveData(updatedPatients, currentPatient);
      
      toast.success('✅ تم إضافة المريض بنجاح');
      setLoading(false);
      return true;
    } catch (error) {
      toast.error('❌ حدث خطأ أثناء إضافة المريض');
      setLoading(false);
      return false;
    }
  };

  // نقل مريض للعلاج
  const moveToTreatment = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      toast.error('❌ المريض غير موجود');
      return;
    }

    if (currentPatient) {
      toast.warning('⚠️ يوجد مريض قيد العلاج حالياً');
      return;
    }

    const updatedPatients = patients.filter(p => p.id !== patientId);
    setCurrentPatient(patient);
    setPatients(updatedPatients);
    saveData(updatedPatients, patient);
    toast.success('🔄 تم نقل المريض للعلاج');
  };

  // إنهاء علاج المريض الحالي
  const finishTreatment = () => {
    if (!currentPatient) {
      toast.warning('⚠️ لا يوجد مريض قيد العلاج');
      return;
    }
    toast.success('✅ تم إنهاء علاج المريض');
    setCurrentPatient(null);
    saveData(patients, null);
  };

  // إلغاء حجز مريض
  const cancelAppointment = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      toast.error('❌ المريض غير موجود');
      return;
    }

    if (patient.type !== 'upcoming') {
      toast.warning('⚠️ يمكن إلغاء الحجوزات المسبقة فقط');
      return;
    }

    if (patient.status === 'waiting' || patient.status === 'in-treatment') {
      toast.warning('⚠️ لا يمكن إلغاء حجز مريض موجود في العيادة');
      return;
    }

    const updatedPatients = patients.filter(p => p.id !== patientId);
    setPatients(updatedPatients);
    saveData(updatedPatients, currentPatient);
    toast.success('🗑️ تم إلغاء الحجز بنجاح');
  };

  const value = {
    patients,
    currentPatient,
    loading,
    addPatient,
    moveToTreatment,
    finishTreatment,
    cancelAppointment,
    setPatients,
    setCurrentPatient
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};