import { defineComponent } from "vue";
import {
  NAlert,
  NButton,
  NUpload,
  UploadCustomRequestOptions,
  useMessage,
} from "naive-ui";
import { postFile } from "../api/file";
import emitter from "../bus";
export default defineComponent({
  setup() {
    const message = useMessage();
    const customRequest = async ({ file }: UploadCustomRequestOptions) => {
      const formData = new FormData();
      formData.append("file", file.file as File);

      const { data } = await postFile(formData);
      if (data.code === 1) {
        message.success("上传成功~");
        emitter.emit("updateFileList");
      } else {
        message.error("上传失败~");
      }
    };
    return () => (
      <header class={"header"}>
        <NUpload custom-request={customRequest} show-file-list={false}>
          <NButton size={"large"} type="success">
            上传文件
          </NButton>
        </NUpload>
        <NAlert type="warning">上传的资源10分钟左右有效</NAlert>
      </header>
    );
  },
});
