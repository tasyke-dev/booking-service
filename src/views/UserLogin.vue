<template>
  <div>
    <h2>Вход</h2>
    <form @submit.prevent="loginUser">
      <input
        type="email"
        v-model="email"
        placeholder="Электронная почта"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Пароль"
        required
      />
      <button type="submit">Войти</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();
    const db = getFirestore();

    const loginUser = async () => {
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Получаем данные пользователя из Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          // Обработка данных пользователя
          const userData = userDoc.data();
          console.log('Данные пользователя:', userData);
        }

        // Перенаправление после успешного входа
        router.push('/admin');
      } catch (err) {
        error.value = err.message;
      }
    };

    return {
      email,
      password,
      error,
      loginUser,
    };
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
