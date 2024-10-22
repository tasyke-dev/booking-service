
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref } from 'vue';

const auth = getAuth();
const user = ref(null);

onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});

export { user };
