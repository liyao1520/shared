import { NGrid, NGridItem } from "naive-ui";
import { defineComponent, onMounted, ref } from "vue";
import { downloadFile, getFileList } from "../api/file";
import FileIcon from "./FileIcon";
import emitter from "../bus";
export default defineComponent({
  setup() {
    const fileList = ref([]);
    const fetchFileList = async () => {
      const { data } = await getFileList();
      fileList.value = data.fileList;
    };
    onMounted(() => {
      // list.value
      fetchFileList();
      emitter.on("updateFileList", fetchFileList);
    });
    const handleClick = async (filename: string) => {
      const { data } = await downloadFile(filename);
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };
    return () => (
      <NGrid x-gap="12" y-gap="8" cols="6" class={"main"}>
        {fileList.value.map((item) => (
          <NGridItem
            class={"file-item"}
            title="点击下载文件"
            onClick={() => handleClick(item)}
          >
            <FileIcon />
            <span>{item}</span>
          </NGridItem>
        ))}
      </NGrid>
    );
  },
});
