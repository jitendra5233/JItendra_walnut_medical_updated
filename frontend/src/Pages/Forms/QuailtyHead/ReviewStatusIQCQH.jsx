import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Button,
  Result,
  Modal,
  Spin,
  Form,
  message,
  Input,
  Select,
  Upload,
  Table,
} from "antd";

import {
  DownloadOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { logoutActiveSystem, saveActiveSystem } from "../../../Redux/Actions";
import TextArea from "antd/es/input/TextArea";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";

const ReviewStatusIQCQH = () => {
  const selector = useSelector((state) => state.persistedReducer);

  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([]);
  const { Option } = Select;
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [Activekey, setActivekey] = useState(0);
  const [exitModel, setExitModel] = useState(false);
  const [exitModel1, setExitModel1] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [SoundBoxModel, setSoundBoxModel] = useState(false);
  const [SystemLogedIn, setSystemLogedIn] = useState(false);
  const [SystemSelectedTime, setSystemSelectedTime] = useState(false);
  useEffect(() => {
    checkLineActive();
    getAllDefectedmaterial();
  }, []);

  const handleCloseexitModel = () => {
    setShowModal(false);
  };
  const handleCloseexitModel1 = () => {
    setExitModel1(false);
  };
  const SoundBoxModelCancel = () => {
    setSoundBoxModel(false);
  };
  const checkLineActive = () => {
    setSystemLogedIn(selector.SystemLogin.isLogedIn);
    setSystemSelectedTime(new Date(selector.SystemLogin.system_login_time));
  };

  const handleSaveSystemLogin = () => {
    let activeTime = new Date();
    setSystemSelectedTime(activeTime);
    let logObj = {
      user_id: selector.user.token,
      isLogedIn: true,
      system_login_time: activeTime,
      type: "IQC",
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/LoginSystem", logObj)
      .then((result) => {
        logObj.system_id = result.data._id;
        dispatch(saveActiveSystem(logObj));
      })
      .catch((err) => {
        console.log(err);
      });

    setSystemLogedIn(true);
    setExitModel(false);
  };
  const props = {
    name: "image",
    action: `${process.env.REACT_APP_API_URL}/uploadTestingImages`,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        updateFileImage(Activekey, info.file.response);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const getAllDefectedmaterial = () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/getAllDefectedmaterial`;
    axios
      .get(apiUrl)
      .then((result) => {
        const data = result.data;
        let newData = [];

        data.forEach((item, index) => {
          const { _id, MaterialParameter, ...rest } = item;

          MaterialParameter.forEach((x, subIndex) => {
            if (x.status === "NOT OK") {
              newData.push({
                key: `${index}-${subIndex}`,
                id: _id,
                parameter: x.parameter,
                spacification: x.spacification,
                actual: x.actual,
                status: x.status,
                remark: x.remark,
                picture: x.picture,
                inst_used: x.inst_used,
                parameter: x.parameter,
                status: x.status,
                material_id: rest.material_id,
                date: new Date(rest.createdAt).toLocaleDateString(),
                Sample_id: rest.Sample_id,
                vendor_name: rest.vendor_name,
                material_name: rest.material_name,
                material_id: rest.material_id,
              });
            }
          });
        });

        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenSystemLogin = () => {
    setExitModel(true);
  };
  const handleLogout = () => {
    setExitModel1(true);
  };

  const handleSystemLogout = () => {
    setSystemLogedIn(false);
    let logObj = {
      id: selector.SystemLogin.system_id,
      time: new Date(),
    };
    axios
      .post(process.env.REACT_APP_API_URL + "/LogoutSystem", logObj)
      .then((result) => {
        dispatch(logoutActiveSystem());
        setExitModel1(false);
        navigate("/incoming_material");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOK = (id) => {
    setSoundBoxModel(true);
  };

  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "vendor_name",
      key: "vendor_name",
      width: 150,
    },
    {
      title: "Material Type",
      dataIndex: "material_name",
      key: "material_name",
      width: 150,
    },
    {
      title: "Sample ID",
      dataIndex: "Sample_id",
      key: "Sample_id",
      width: 150,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Select
          placeholder="Select Status"
          allowClear
          style={{ minWidth: "100px", textAlign: "center" }}
          value={record.status}
          onChange={(value) => handleStatusChange(record.key, value)}
        >
          <Option value="OK">OK</Option>
          <Option value="NOT OK">NOT OK</Option>
        </Select>
      ),
    },
    {
      title: "Parameter",
      dataIndex: "parameter",
      key: "parameter",
      render: (_, record) => (
        <Input
          onChange={(e) => handleParameterChange(record.key, e.target.value)}
          value={record.parameter}
          style={{ width: "150px" }}
          readOnly
        />
      ),
    },
    {
      title: "Spacification(mm)",
      dataIndex: "spacification",
      key: "spacification",
      render: (_, record) => (
        <Input
          onChange={(e) =>
            handleSpacificationChange(record.key, e.target.value)
          }
          value={record.spacification}
          style={{ width: "150px" }}
          readOnly
        />
      ),
    },
    {
      title: "Actual",
      dataIndex: "actual",
      key: "actual",
      render: (_, record) => (
        <Input
          onChange={(e) => handleActualChange(record.key, e.target.value)}
          value={record.actual}
          style={{ width: "150px" }}
        />
      ),
    },

    {
      title: "Remarks",
      dataIndex: "remark",
      key: "remark",
      render: (_, record) => (
        <TextArea
          onChange={(e) => handleRemarksChange(record.key, e.target.value)}
          value={record.remark}
          style={{ width: "150px" }}
        />
      ),
    },
    // {
    //   title: "Pictures",
    //   dataIndex: "pictures",
    //   key: "pictures",
    //   render: (_, record) => (
    //     <div style={{ paddingRight: "20px" }}>
    //       <Upload
    //         {...props}
    //         maxCount={1}
    //         value={record.picture}
    //         onClick={() => setActivekey(record.key)}
    //         onRemove={() => handleImageRemove(record.key)}
    //       >
    //         <Button icon={<UploadOutlined />}>Upload image</Button>
    //       </Upload>
    //     </div>
    //   ),
    // },
    {
      title: "Ins used",
      dataIndex: "inst_used",
      key: "inst_used",
      render: (_, record) => (
        <Input
          onChange={(e) => handleInstrumentChange(record.key, e.target.value)}
          value={record.inst_used}
          style={{ width: "150px" }}
        />
      ),
    },
    // {
    //   title: "Review",
    //   key: "Review",
    //   render: (_, record) => (
    //     <div>
    //       <a onClick={() => handleOK(record.id)}>
    //         <span>
    //           <Button key="buy" type="primary" className="circular-button">
    //             {record.status}
    //           </Button>
    //         </span>
    //       </a>
    //     </div>
    //   ),
    // },
  ];

  const handleParameterChange = (key, value) => {
    const updatedTableData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, parameter: value };
      }
      return item;
    });

    setTableData(updatedTableData);
  };

  const handleSpacificationChange = (key, value) => {
    const updatedTableData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, spacification: value };
      }
      return item;
    });

    setTableData(updatedTableData);
  };

  const handleActualChange = (key, value) => {
    const updatedTableData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, actual: value };
      }
      return item;
    });

    setTableData(updatedTableData);
  };

  const handleStatusChange = (key, value) => {
    const updatedTableData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, status: value };
      }
      return item;
    });

    setTableData(updatedTableData);
  };

  const handleRemarksChange = (key, value) => {
    const updatedTableData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, remark: value };
      }
      return item;
    });

    setTableData(updatedTableData);
  };
  const handleInstrumentChange = (key, value) => {
    const updatedTableData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, inst_used: value };
      }
      return item;
    });

    setTableData(updatedTableData);
  };

  const handleImageRemove = (key) => {
    const updatedTableData = [...tableData];
    updatedTableData[key].picture = "";
    setTableData(updatedTableData);
  };
  function updateFileImage(key, value) {
    form.setFieldsValue({
      [`picture_${key}`]: value,
    });
  }

  const handleSaveData = () => {
    const postData = tableData.map((item) => ({
      ...item,
      id: item.material_id,
      sample_id: item.Sample_id,
      parameter: item.parameter,
      spacification: item.spacification,
      inst_used: item.inst_used,
      actual: item.actual,
      status: item.status,
      picture: item.picture || form.getFieldValue(`picture_${item.key}`) || "",
      remark: item.remark,
    }));

    axios
      .post(process.env.REACT_APP_API_URL + "/updatematParameters", {
        MaterialParameter: postData,
      })
      .then((response) => {
        getAllDefectedmaterial();
        setSoundBoxModel(false);
        message.success("Data saved successfully!");
      })
      .catch((error) => {
        message.error("Error saving data.");
      });
  };
  const handleExcelImport = () => {
    const wb = XLSX.utils.book_new();

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    const formattedBatchList = tableData.map((item) => {
      const {
        MaterialParameter,
        material_id,
        __v,
        id,
        picture,
        key,
        createdAt,
        ...rest
      } = item;
      return {
        ...rest,
        CreatedDateTime: item.date,
      };
    });

    // Convert the table data to worksheet with formatted createdAt
    const ws = XLSX.utils.json_to_sheet(formattedBatchList);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate a download link for the workbook
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Defected_Material_data.xlsx";
    a.click();
  };

  return (
    <div>
      <Row style={{ marginBottom: "10px" }}>
        <Col span={12}>
          <span className="TopMenuTxt">Incoming Material has been checked</span>
        </Col>
        <Col span={12}>
          <span
            className="TopMenuTxt"
            style={{ float: "right", marginRight: "15px" }}
          >
            <Button
              key="excelImport"
              type="primary"
              onClick={handleExcelImport}
              style={{ marginRight: "15px" }}
            >
              Export Report <DownloadOutlined />
            </Button>
            {/* <Button key="filter" type="primary" onClick={handleFilterClick}>
              Filter
              <FilterOutlined />
            </Button> */}
          </span>
        </Col>
      </Row>

      <Row style={{ marginTop: "2rem" }}>
        {tableData.length != 0 ? (
          <Col span={24} style={{ backgroundColor: "#fff", padding: "20px" }}>
            <div>
              <div style={{ overflowX: "auto" }}>
                <Table
                  columns={columns}
                  dataSource={tableData}
                  pagination={true}
                  rowClassName={(record) =>
                    record.status === "NOT OK" ? "not-ok-row" : ""
                  }
                  style={{ marginTop: "15px" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}
              ></div>
            </div>
          </Col>
        ) : (
          <Col span={24} style={{ backgroundColor: "#fff" }}>
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default ReviewStatusIQCQH;
