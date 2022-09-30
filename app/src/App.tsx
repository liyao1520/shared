import { NMessageProvider } from "naive-ui";
import { defineComponent } from "vue";
import Header from "./components/Header";
import Main from "./components/Main";

export default defineComponent({
  setup() {
    return () => (
      <NMessageProvider>
        <Header />
        <Main />
      </NMessageProvider>
    );
  },
});
