<template>
    <div>
      <h3>Список броней</h3>
      <ul>
        <li v-for="booking in bookings" :key="booking.id">
          <p>Пользователь: {{ booking.userEmail }}</p>
          <p>Услуга: {{ booking.serviceName }}</p>
          <p>Дата бронирования: {{ booking.bookingDate }}</p>
          <button @click="deleteBooking(booking.id)">Удалить бронь</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { db } from '../firebase';
  import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
  
  export default {
    setup() {
      const bookings = ref([]);
  
      const loadBookings = async () => {
        const bookingsCollection = collection(db, 'bookings');
        const bookingsSnapshot = await getDocs(bookingsCollection);
        bookings.value = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      };
  
      const deleteBooking = async (id) => {
        const bookingDoc = doc(db, 'bookings', id);
        await deleteDoc(bookingDoc);
        await loadBookings();
      };
  
      onMounted(loadBookings);
  
      return {
        bookings,
        deleteBooking,
      };
    },
  };
  </script>
  
  <style scoped>
  h3 {
    color: #42b983;
  }
  ul {
    list-style-type: none;
  }
  button {
    margin-top: 10px;
    background-color: #42b983;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  }
  button:hover {
    background-color: #39a079;
  }
  </style>
  