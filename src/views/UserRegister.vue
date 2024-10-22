<template>
  <div>
    <h2>Регистрация</h2>
    <form @submit.prevent="registerUser">
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
      <button type="submit">Зарегистрироваться</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();
    const db = getFirestore();

    const registerUser = async () => {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Сохраняем пользователя в Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: 'admin', // По умолчанию назначаем роль "user", для теста "admin"
        });

        // Перенаправление после успешной регистрации
        router.push('/login');
      } catch (err) {
        error.value = err.message;
      }
    };

    return {
      email,
      password,
      error,
      registerUser,
    };
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
