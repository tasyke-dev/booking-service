<template>
  <div>
    <h1>Бронирование услуги {{ serviceName }}</h1>
    <p v-if="user">Вы вошли как: {{ user.email }}</p>

    <form @submit.prevent="submitBooking">
      <label for="name">Имя:</label>
      <input type="text" v-model="formData.name" required />

      <label for="date">Дата:</label>
      <input type="date" v-model="formData.date" required />

      <button type="submit">Отправить бронирование</button>
    </form>

    <p v-if="bookingSuccess" class="success-message">Бронирование успешно!</p>
    <p v-if="bookingError" class="error-message">{{ bookingError }}</p>
  </div>
</template>

<script>
import { user } from '../auth'; // Импортируем состояние аутентификации
import { db } from '../firebase'; // Импортируем Firestore
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default {
  name: 'BookingService',
  data() {
    return {
      serviceId: this.$route.params.id,
      serviceName: '', 
      formData: {
        name: '',
        date: ''
      },
      bookingSuccess: false, // Переменная для отображения успешного бронирования
      bookingError: null // Переменная для отображения ошибки
    };
  },
  setup() {
    return { user }; // Возвращаем пользователя для использования в шаблоне
  },
  methods: {
    // Функция для отправки данных бронирования
    async submitBooking() {
      try {
        // Проверка, не существует ли уже бронирования на выбранную дату
        const bookingsCollection = collection(db, 'bookings');
        const bookingQuery = query(
          bookingsCollection,
          where('serviceId', '==', this.serviceId),
          where('date', '==', this.formData.date)
        );
        const querySnapshot = await getDocs(bookingQuery);

        if (!querySnapshot.empty) {
          this.bookingError = 'На выбранную дату уже есть бронирование.';
          return;
        }

        // Добавление бронирования в Firestore
        await addDoc(bookingsCollection, {
          serviceId: this.serviceId,
          serviceName: this.serviceName,
          name: this.formData.name,
          date: this.formData.date,
          userEmail: user.value ? user.value.email : 'Гость'
        });

        // Если бронирование прошло успешно
        this.bookingSuccess = true;
        this.bookingError = null;
        this.resetForm(); // Сброс формы после успешного бронирования
      } catch (error) {
        console.error('Ошибка при бронировании:', error);
        this.bookingError = 'Произошла ошибка при бронировании.';
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.date = '';
    }
  },
  async created() {
    // Получение имени услуги из базы данных
    const serviceDoc = doc(db, 'services', this.serviceId);
    const serviceSnapshot = await getDoc(serviceDoc);
    if (serviceSnapshot.exists()) {
      this.serviceName = serviceSnapshot.data().name; // Устанавливаем имя услуги
    } else {
      console.error('Услуга не найдена!');
    }
  }
};
</script>

<style scoped>
h1 {
  color: #42b983;
}
form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 300px;
}
label {
  margin-top: 10px;
}
button {
  margin-top: 20px;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}
button:hover {
  background-color: #39a079;
}
.success-message {
  color: green;
  margin-top: 20px;
}
.error-message {
  color: red;
  margin-top: 20px;
}
</style>
