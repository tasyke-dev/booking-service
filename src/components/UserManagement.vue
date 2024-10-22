<template>
  <div>
    <h3>Управление пользователями</h3>
    <ul>
      <li v-for="user in users" :key="user.id">
        <p>{{ user.email }}</p>
        <p>{{ user.role }}</p>
        <button @click="changeUserRole(user)">{{ user.role === 'user' ? 'Сделать администратором' : 'Сделать пользователем' }}</button>
        <button @click="deleteUser(user.id)">Удалить пользователя</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default {
  setup() {
    const users = ref([]);

    const loadUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      users.value = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const changeUserRole = async (user) => {
      const userDoc = doc(db, 'users', user.id);
      const newRole = user.role === 'user' ? 'admin' : 'user';
      await updateDoc(userDoc, { role: newRole });
      await loadUsers();
    };

    const deleteUser = async (id) => {
      const userDoc = doc(db, 'users', id);
      await deleteDoc(userDoc);
      await loadUsers();
    };

    onMounted(loadUsers);

    return {
      users,
      changeUserRole,
      deleteUser,
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
