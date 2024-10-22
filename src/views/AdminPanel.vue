<template>
    <div>
      <h2>Админ-панель</h2>
  
      <h3>Список услуг</h3>
        <table>
        <thead>
            <tr>
            <th>Название услуги</th>
            <th>Описание</th>
            <th>Цена</th>
            <th>Действия</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="service in services" :key="service.id">
            <td>{{ service.name }}</td>
            <td>{{ service.description }}</td>
            <td>{{ service.price }}</td>
            <td>
                <button @click="prepareEditService(service)">Редактировать</button>
                <button @click="deleteService(service.id)">Удалить</button>
            </td>
            </tr>
        </tbody>
        </table>

  
      <h3>{{ editingService ? 'Редактировать услугу' : 'Добавить новую услугу' }}</h3>
      <div> 
        <form @submit.prevent="editingService ? updateService() : addService()">
            <input v-model="newService.name" placeholder="Название услуги" required />
            <input v-model="newService.description" placeholder="Описание услуги" required />
            <input type="number" v-model="newService.price" placeholder="Цена услуги" required />
            <button type="submit">{{ editingService ? 'Обновить услугу' : 'Добавить услугу' }}</button>
        </form>
      </div>
      <UserManagement /> 
  
      <BookingList /> 
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { db } from '../firebase';
  import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
  import UserManagement from '../components/UserManagement.vue'; 
  import BookingList from '../components/BookingList.vue'; 
  
  export default {
    components: {
      UserManagement,
      BookingList, 
    },
    setup() {
      const services = ref([]);
      const newService = ref({
        name: '',
        description: '',
        price: ''
      });
      const editingService = ref(null);
  
      const loadServices = async () => {
        const servicesCollection = collection(db, 'services');
        const servicesSnapshot = await getDocs(servicesCollection);
        services.value = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      };
  
      const addService = async () => {
        const servicesCollection = collection(db, 'services');
        await addDoc(servicesCollection, { ...newService.value });
        resetForm();
        await loadServices();
      };
  
      const deleteService = async (id) => {
        const serviceDoc = doc(db, 'services', id);
        await deleteDoc(serviceDoc);
        await loadServices();
      };
  
      const prepareEditService = (service) => {
        editingService.value = { ...service };
        newService.value = { ...service };
      };
  
      const updateService = async () => {
        const serviceDoc = doc(db, 'services', editingService.value.id);
        await updateDoc(serviceDoc, { ...newService.value });
        resetForm();
        await loadServices();
      };
  
      const resetForm = () => {
        newService.value = { name: '', description: '', price: '' };
        editingService.value = null;
      };
  
      onMounted(loadServices);
  
      return {
        services,
        newService,
        editingService,
        addService,
        deleteService,
        prepareEditService,
        updateService,
      };
    }
  };
  </script>
  
  <style scoped>
  form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 300px;
}
  h2 {
    color: #42b983;
  }

  input {
    margin-top: 10px;
  }

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f1f1f1;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: #39a079;
}

  </style>
  