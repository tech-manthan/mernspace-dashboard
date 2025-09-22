import { Form, Space, Typography, Upload, type UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { RcFile } from "antd/es/upload";
import { useToast } from "../../hooks/useToast";

export const ImageUploader = ({
  image,
  name,
}: {
  image?: string;
  name?: string;
}) => {
  const toast = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(image ?? null);

  const form = Form.useFormInstance();
  const imageValue = Form.useWatch<RcFile | string>("image", form);

  useEffect(() => {
    if (!imageValue) {
      setImageUrl(null);
      return;
    }

    if (imageValue instanceof File) {
      const objectUrl = URL.createObjectURL(imageValue);
      setImageUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
        setImageUrl(null);
      };
    }

    if (typeof imageValue === "string") {
      setImageUrl(imageValue);
    }
  }, [imageValue]);

  const uploaderConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      // Validation logic
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        toast.error("You can only upload JPG/PNG file!");
        return Upload.LIST_IGNORE;
      }

      // Let form handle the file, stop auto-upload
      return false;
    },
  };

  return (
    <Form.Item
      name="image"
      valuePropName="file"
      getValueFromEvent={(e) => e.file}
      rules={[
        {
          required: true,
          message: `Please upload a ${name ? name : ""} image`,
        },
      ]}
    >
      <Upload listType="picture-card" {...uploaderConfig}>
        {imageUrl ? (
          <img src={imageUrl} alt="preview" style={{ width: "100%" }} />
        ) : (
          <Space direction="vertical">
            <PlusOutlined />
            <Typography.Text>Upload</Typography.Text>
          </Space>
        )}
      </Upload>
    </Form.Item>
  );
};
