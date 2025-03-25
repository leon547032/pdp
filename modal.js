import React, { useEffect, useState, useCallback } from "react";
import { Form, Select, Button, Pagination } from "antd";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const { Option } = Select;

const FlatGridWithDetail = () => {
  const [form] = Form.useForm();
  const [mainData, setMainData] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [selectedDeviceCd, setSelectedDeviceCd] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const fetchData = useCallback(async (values = {}) => {
    try {
      const response = await axios.get("/reqs/flat", {
        params: {
          ...values,
          page,
          size,
          sort: "crtDt,desc"
        }
      });

      const list = response.data.content || [];
      setMainData(list);
      setTotal(response.data.totalElements);

      if (list.length > 0) {
        const first = list[0];
        updateLayerList(first.layerCdList, first.mpsDeviceCd);
      } else {
        setSelectedLayers([]);
        setSelectedDeviceCd(null);
      }
    } catch (e) {
      console.error("데이터 로딩 실패", e);
    }
  }, [page, size]);

  const updateLayerList = (layerCdList, deviceCd) => {
    setSelectedDeviceCd(deviceCd);

    if (!layerCdList) return setSelectedLayers([]);
    const splitList = layerCdList.split(",").map((cd, idx) => ({
      id: idx + 1,
      layerCd: cd
    }));
    setSelectedLayers(splitList);
  };

  useEffect(() => {
    fetchData(form.getFieldsValue());
  }, [page, size, fetchData]);

  const handleSearch = () => {
    setPage(0);
    fetchData(form.getFieldsValue());
  };

  const onMainRowClicked = useCallback((event) => {
    updateLayerList(event.data.layerCdList, event.data.mpsDeviceCd);
  }, []);

  const onLayerRowClicked = useCallback((event) => {
    const layerCd = event.data.layerCd;
    console.log("✅ 선택된 DeviceCd:", selectedDeviceCd);
    console.log("✅ 선택된 LayerCd:", layerCd);
  }, [selectedDeviceCd]);

  const mainColumns = [
    { headerName: "요청번호", field: "reqSeqno" },
    { headerName: "디바이스", field: "mpsDeviceCd" },
    { headerName: "레이어 목록", field: "layerCdList", flex: 1 },
  ];

  const detailColumns = [
    { headerName: "순번", field: "id", width: 80 },
    { headerName: "레이어 코드", field: "layerCd", flex: 1 },
  ];

  return (
    <>
      {/* 필터 Form */}
      <Form form={form} layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Form.Item name="deviceCd" label="Device">
          <Select placeholder="선택" allowClear style={{ width: 120 }}>
            <Option value="D01">D01</Option>
            <Option value="D02">D02</Option>
          </Select>
        </Form.Item>
        <Form.Item name="revCd" label="Rev">
          <Select placeholder="선택" allowClear style={{ width: 120 }}>
            <Option value="R01">R01</Option>
            <Option value="R02">R02</Option>
          </Select>
        </Form.Item>
        <Form.Item name="maskId" label="Mask ID">
          <Select placeholder="선택" allowClear style={{ width: 120 }}>
            <Option value="M01">M01</Option>
            <Option value="M02">M02</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">검색</Button>
        </Form.Item>
      </Form>

      {/* 첫 번째 Grid (요청 리스트, 페이징 O) */}
      <div className="ag-theme-alpine" style={{ height: 300 }}>
        <AgGridReact
          rowData={mainData}
          columnDefs={mainColumns}
          rowSelection="single"
          onRowClicked={onMainRowClicked}
          domLayout="autoHeight"
        />
      </div>

      {/* 페이징 컨트롤 */}
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Pagination
          current={page + 1}
          pageSize={size}
          total={total}
          showSizeChanger
          onChange={(p, s) => {
            setPage(p - 1);
            setSize(s);
          }}
        />
      </div>

      {/* 두 번째 Grid (선택된 레이어 리스트, 페이징 X) */}
      <h4 style={{ marginTop: 32 }}>선택된 레이어 목록</h4>
      <div className="ag-theme-alpine" style={{ height: 200 }}>
        <AgGridReact
          rowData={selectedLayers}
          columnDefs={detailColumns}
          domLayout="autoHeight"
          rowSelection="single"
          onRowClicked={onLayerRowClicked}
        />
      </div>
    </>
  );
};

export default FlatGridWithDetail;
