import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Space,
  message,
  Select,
} from "antd";
import {
  UploadOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import axios from "axios";
import Colors from "../libs/Colors";
import { hosturl } from "../libs/Constant";
import axiosConfig from "../../service/axiosConfig";
const { Title, Text } = Typography;

const StoreSettingsPage = () => {
  const [form] = Form.useForm();
  const [storeExists, setStoreExists] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [logoUrl, setLogoUrl] = useState("");
  const { Option } = Select;
  const [pincodeOptions, setPincodeOptions] = useState([]);
  const [loadingPincodes, setLoadingPincodes] = useState(false);
  const countries = [{ label: "India", value: "India" }];

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null); // local preview if new image selecte
  const uploadRef = useRef();

  useEffect(() => {
    axios
      .get(`${hosturl}/location/states`)
      .then((res) => {
        const stateList = res.data?.result;
        if (Array.isArray(stateList)) {
          setStates(stateList);
          console.log("States fetched:", stateList);
        } else {
          setStates([]);
          console.error("Unexpected states response format:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching states:", err);
        setStates([]);
      });
  }, []);

  // Fetch districts whenever selectedStates change
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedStates.length > 0) {
        const fetchDistrictsForStates = async () => {
          setLoadingDistricts(true);
          const allDistricts = [];

          await Promise.all(
            selectedStates.map((state) =>
              axios
                .get(`${hosturl}/location/districts/${state}`)
                .then((res) => {
                  if (res.data.result) {
                    allDistricts.push(...res.data.result);
                  }
                })
                .catch((err) =>
                  console.error(`Failed to fetch districts for ${state}`, err)
                )
            )
          );

          setDistricts([...new Set(allDistricts)]);
          setLoadingDistricts(false);
        };

        fetchDistrictsForStates();
      }
    };

    fetchDistricts();
  }, [selectedStates]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axiosConfig.get(`/vendor/store`);
        if (response.status === 200) {
          const data = response.data.result;
          const logoUrl = data.logo
            ? `${axiosConfig.getUri()}${data.logo}`
            : "";
          form.setFieldsValue({
            storeName: data.name,
            storeDescription: data.description || "",
            contactName: data.contactName || "",
            contactEmail: data.contactEmail || "",
            phoneNumber: data.phoneNumber || "",
            storeAddress: data.address || "",
            websiteURL: data.websiteURL || "",
            country: data.country || "",
            states: data.states || [],
            districts: data.districts || [],
            facebook: data.socialMediaLinks?.facebook || "",
            instagram: data.socialMediaLinks?.instagram || "",
            twitter: data.socialMediaLinks?.twitter || "",
          });
          const selectedCountry = data.country;
          const selectedStates = data.states || [];
          setSelectedStates(selectedStates || []);
          const allDistricts = selectedStates.flatMap((state) => [state] || []);
          setDistricts(allDistricts);

          setStoreExists(true);
          setIsEditing(false);
          setLogoUrl(logoUrl);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setStoreExists(false);
        } else {
          message.error("Failed to fetch store details.");
        }
      }
    };

    fetchStore();
  }, [form]);

  useEffect(() => {
    const fetchPincodes = async () => {
      setLoadingPincodes(true);
      try {
        const res = await axios.get("https://api.zodeals.in/pincode");
        if (res.data.status && Array.isArray(res.data.result)) {
          setPincodeOptions(res.data.result.map((pin) => pin.toString()));
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setStoreExists(false);
        } else {
          message.error("Failed to fetch pincodes.");
        }
      }
      setLoadingPincodes(false);
    };
    fetchPincodes();
  }, []);
  const uploadProps = {
    beforeUpload: () => false,
    listType: "picture-card",
    maxCount: 1,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
  };
  const handleSubmit = async (values) => {
    console.log({ values });

    const formData = new FormData();

    formData.append("name", values.storeName);
    formData.append("description", values.storeDescription || "");
    formData.append("contactName", values.contactName || "");
    formData.append("contactEmail", values.contactEmail || "");
    formData.append("phoneNumber", values.phoneNumber || "");
    formData.append("address", values.storeAddress || "");
    formData.append("websiteURL", values.websiteURL || "");

    formData.append("country", values.country || "");
    values.states?.forEach((state, index) => {
      formData.append(`states[${index}]`, state);
    });
    values.districts?.forEach((district, index) => {
      formData.append(`districts[${index}]`, district);
    });

    if (values.facebook)
      formData.append("socialMediaLinks[facebook]", values.facebook);
    if (values.instagram)
      formData.append("socialMediaLinks[instagram]", values.instagram);
    if (values.twitter)
      formData.append("socialMediaLinks[twitter]", values.twitter);

    if (values.storeLogo && values.storeLogo.length > 0) {
      formData.append("logo", values.storeLogo[0].originFileObj);
    }
    if (values.pincodes && values.pincodes.length > 0) {
      formData.append("pinCodes", values.pincodes);
    }
    const method = storeExists ? "patch" : "post";
    const url = `${hosturl}/vendor/store`;
    const token = localStorage.getItem("token");

    try {
      const response = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (
        (storeExists && response.status === 200) ||
        (!storeExists && response.status === 201)
      ) {
        localStorage.setItem("is_store_created", JSON.stringify(true));
        message.success(
          `Store ${storeExists ? "updated" : "created"} successfully!`
        );
        setStoreExists(true);
        setIsEditing(false);
      }
    } catch (error) {
      if (error.response?.data?.displayMessage) {
        message.error(error.response.data.displayMessage); // 🔥 Show backend message
      } else {
        message.error("Submission failed. Please try again.");
      }
      console.error("Error submitting store info:", error);
    }
  };

  const sectionTitle = (icon, text) => (
    <Space>
      {icon}
      <Title level={4} style={{ margin: 0, color: Colors.primary }}>
        {text}
      </Title>
    </Space>
  );

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Card
        title={
          <span
            style={{
              fontSize: "20px",
              fontWeight: "500",
              fontFamily: "Poppins",
            }}
          >
            Store Settings
          </span>
        }
        className="shadow-xl rounded-2xl"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Divider orientation="left" plain>
            {sectionTitle(<InfoCircleOutlined />, "Basic Information")}
          </Divider>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="storeName"
                label={<Text strong>Store Name</Text>}
                rules={[
                  { required: true, message: "Please input your store name!" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter store name"
                  disabled={!isEditing}
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="storeLogo"
                label={<Text strong>Store Logo</Text>}
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[
                  {
                    validator: (_, value) => {
                      const existingLogo = logoUrl || previewLogo;
                      if ((value && value.length > 0) || existingLogo) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Store logo is required")
                      );
                    },
                  },
                ]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  disabled={!isEditing}
                  beforeUpload={(file) => {
                    setPreviewLogo(URL.createObjectURL(file));
                    form.setFieldsValue({
                      storeLogo: [file],
                    });
                    return false;
                  }}
                  showUploadList={false}
                >
                  {!(
                    form.getFieldValue("storeLogo")?.length ||
                    logoUrl ||
                    previewLogo
                  ) && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <UploadOutlined style={{ fontSize: 24 }} />
                        <Text style={{ marginTop: 8 }}>Upload Logo</Text>
                      </div>
                    )}
                </Upload>
              </Form.Item>

              {(previewLogo ||
                form.getFieldValue("storeLogo")?.[0]?.thumbUrl ||
                logoUrl) && (
                  <div
                    onClick={() => {
                      if (isEditing) {
                        document.querySelector('input[type="file"]')?.click();
                      }
                    }}
                    style={{
                      marginTop: 8,
                      position: "relative",
                      display: "inline-block",
                      cursor: isEditing ? "pointer" : "default",
                      border: "1px solid #ccc",
                      borderRadius: 4,
                    }}
                  >
                    <img
                      crossOrigin="anonymous"
                      src={
                        previewLogo ||
                        form.getFieldValue("storeLogo")?.[0]?.thumbUrl ||
                        logoUrl
                      }
                      alt="Store Logo"
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "contain",
                        borderRadius: 4,
                      }}
                    />
                    {isEditing && (
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: 4,
                          fontSize: 12,
                          color: "#999",
                        }}
                      >
                        Click to change
                      </div>
                    )}
                  </div>
                )}
            </Col>
          </Row>

          <Form.Item
            name="storeDescription"
            label={<Text strong>Description</Text>}
          >
            <Input.TextArea
              rows={4}
              placeholder="Describe your store"
              disabled={!isEditing}
            />
          </Form.Item>

          <Divider orientation="left" plain>
            {sectionTitle(<PhoneOutlined />, "Contact Information")}
          </Divider>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="contactName"
                label={<Text strong>Contact Person</Text>}
              >
                <Input
                  size="large"
                  placeholder="John Doe"
                  disabled={!isEditing}
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="contactEmail"
                label={<Text strong>Email</Text>}
                rules={[
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="email@example.com"
                  disabled={!isEditing}
                  prefix={<MailOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="phoneNumber"
            label={<Text strong>Phone Number</Text>}
          >
            <Input
              size="large"
              placeholder="+91 234567890"
              disabled={!isEditing}
              prefix={<PhoneOutlined />}
              maxLength={10}
            />
          </Form.Item>

          <Divider orientation="left" plain>
            {sectionTitle(<GlobalOutlined />, "Social Media Links")}
          </Divider>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="facebook"
                label={<Text strong>Facebook URL</Text>}
              >
                <Input
                  size="large"
                  placeholder="https://facebook.com/yourpage"
                  disabled={!isEditing}
                  prefix={<GlobalOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="instagram"
                label={<Text strong>Instagram URL</Text>}
              >
                <Input
                  size="large"
                  placeholder="https://instagram.com/yourpage"
                  disabled={!isEditing}
                  prefix={<GlobalOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="twitter" label={<Text strong>Twitter URL</Text>}>
                <Input
                  size="large"
                  placeholder="https://twitter.com/yourhandle"
                  disabled={!isEditing}
                  prefix={<GlobalOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" plain>
            {sectionTitle(<GlobalOutlined />, "Location & Online Presence")}
          </Divider>

          <Form.Item name="country" label={<Text strong>Country</Text>}>
            <Select
              size="large"
              placeholder="Select your country"
              disabled={!isEditing}
            >
              {countries.map((country) => (
                <Select.Option key={country.value} value={country.value}>
                  {country.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="states" label={<Text strong>States</Text>}>
            <Select
              mode="multiple" // ✅ Replaces 'tags' to prevent custom input
              size="large"
              placeholder="Select states"
              disabled={!isEditing}
              onChange={setSelectedStates}
              loading={states.length === 0}
              showSearch
              optionFilterProp="children"
            >
              {states.map((state) => (
                <Option key={state} value={state}>
                  {state}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="districts" label={<Text strong>Districts</Text>}>
            <Select
              mode="multiple" // ✅ Prevent custom typing
              size="large"
              placeholder="Select districts"
              disabled={!isEditing}
              loading={loadingDistricts}
              showSearch
              optionFilterProp="children"
            >
              {districts.map((district) => (
                <Option key={district} value={district}>
                  {district}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="storeAddress"
            label={<Text strong>Store Address</Text>}
          >
            <Input
              size="large"
              placeholder="123 Main St, City, State, ZIP"
              disabled={!isEditing}
              prefix={<EnvironmentOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="pincodes"
            label={<Text strong>Enter Pin Codes</Text>}
          >
            <Select
              mode="multiple"
              showSearch
              size="large"
              placeholder="Select pincodes"
              disabled={!isEditing}
              loading={loadingPincodes}
              optionFilterProp="children"
            >
              {pincodeOptions.map((pin) => (
                <Option key={pin} value={pin}>
                  {pin}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              disabled={!isEditing}
              style={{
                width: 160,
                backgroundColor: Colors.secondary,
                color: "#fff",
                fontFamily: "Poppins",
              }}
            >
              {storeExists ? "Update Store" : "Create Store"}
            </Button>
            {storeExists && !isEditing && (
              <Button
                type="primary"
                size="large"
                onClick={() => setIsEditing(true)}
                style={{
                  marginLeft: 16,
                  backgroundColor: Colors.primary,
                  color: "#fff",
                  fontFamily: "Poppins",
                }}
              >
                Edit Store Info
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StoreSettingsPage;
