<template>
  <div>
    <h1>Список услуг</h1>
    <table>
  <thead>
    <tr>
      <th>Название</th>
      <th>Описание</th>
      <th>Цена</th>
      <th>Действие</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="service in services" :key="service.id">
      <td>{{ service.name }}</td>
      <td>{{ service.description }}</td>
      <td>{{ service.price }}</td>
      <td>
        <router-link :to="{ name: 'Booking', params: { id: service.id } }">
          Забронировать
        </router-link>
      </td>
    </tr>
  </tbody>
</table>
  </div>
</template>

<script>
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      services: [],
    };
  },
  async created() {
    const servicesCollection = collection(db, 'services');
    const servicesSnapshot = await getDocs(servicesCollection);
    this.services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};
</script>

<style scoped>
h1 {
  color: #42b983;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
  color: #333;
  font-weight: bold;
}

td {
  vertical-align: middle;
}

router-link {
  color: #42b983;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
  color: #39a079;
}
</style>
