import { useReducer, useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";

// 초기 상태
const initialState = {
  stateMapGrpList: [],
  stateItemList: [],
  stateOrgItemList: [],
  stateDeviceCd: "",
  stateLayerCd: "",
};

// 리듀서 함수 정의
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DEVICE_CD":
      return {
        ...state,
        stateDeviceCd: action.payload, // 문자열로 처리
      };
    case "SET_LAYER_CD":
      return {
        ...state,
        stateLayerCd: action.payload, // 문자열로 처리
      };
    case "ADD_MAP_GRP":
      return {
        ...state,
        stateMapGrpList: [...state.stateMapGrpList, action.payload],
      };
    case "ADD_ITEM":
      return {
        ...state,
        stateItemList: [...state.stateItemList, action.payload],
      };
    case "ADD_ORG_ITEM":
      return {
        ...state,
        stateOrgItemList: [...state.stateOrgItemList, action.payload],
      };
    case "RESET_DATA_STATE":
      return {
        ...state,
        stateMapGrpList: [],
        stateItemList: [],
        stateOrgItemList: [],
      };
    case "INIT_STATE":
      return initialState;
    default:
      return state;
  }
};

// MPS로부터 받아오는 BASE MAP 좌표 리스트
const getBaseMapItemList = async (deviceCd) => {
  try {
    const response = await axios.get(`https://your-api-endpoint.com/getBaseMapItemList`, {
      params: { deviceCd },
    });
    return response.data.baseMapItemList;
  } catch (error) {
    console.error("Error fetching base map data:", error);
    return [];
  }
};

// RRS에 저장된 DIE SPLIT 리스트
const getMapGrpList = async (deviceCd, layerCd) => {
  try {
    const response = await axios.get(`https://your-api-endpoint.com/getMapGrpList`, {
      params: { mpsDeviceCd: deviceCd, mpsLayerCd: layerCd },
    });
    return response.data.baseMapItemList;
  } catch (error) {
    console.error("Error fetching base map data:", error);
    return [];
  }
};

// RRS에 DIE SPLIT 정보 저장
const saveMapGrpList = async (deviceCd, layerCd, state) => {
  let params = {
    mapGrpId: "",
    mapGrpNm: "",
    mpsDeviceCd: deviceCd,
    mpsLayerCd: layerCd,
    dieSplitItemInfoList: state.stateItemList,
  };

  if (_.isEmpty(state.stateMapGrpList)) {
    params.mapGrpId = "MAP-" + deviceCd + "-" + layerCd;
    params.mapGrpNm = "MAP-" + deviceCd + "-" + layerCd;
  }

  try {
    const response = await axios.post(`https://your-api-endpoint.com/saveMapGrpList`, {
      params: params,
    });
    return response.data.baseMapItemList;
  } catch (error) {
    console.error("Error saving map group data:", error);
    return [];
  }
};

// RRS에 저장된 DIE SPLIT 리스트 데이터 파싱
const parseMapGrpList = (mapGrpList, dispatch) => {
  mapGrpList.forEach((mapGrp) => {
    dispatch({ type: "ADD_MAP_GRP", payload: mapGrp });
    mapGrp.forEach((item) => {
      dispatch({ type: "ADD_ITEM", payload: item });
      dispatch({ type: "ADD_ORG_ITEM", payload: item });
    });
  });
};

// MPS로부터 받아오는 BASE MAP 좌표 리스트 데이터 파싱
const parseBaseMapItemList = (baseMapItemList, dispatch) => {
  baseMapItemList.forEach((item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    dispatch({ type: "ADD_ORG_ITEM", payload: item });
  });
};

// 데이터 RELOAD STATE 리셋
const resetState = (dispatch) => {
  dispatch({ type: "RESET_DATA_STATE" });
};

const MyComponent = ({ deviceCd, layerCd }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  // deviceCd와 layerCd 상태 업데이트
  useEffect(() => {
    dispatch({ type: "SET_DEVICE_CD", payload: deviceCd });
    dispatch({ type: "SET_LAYER_CD", payload: layerCd });
  }, [deviceCd, layerCd]); // deviceCd나 layerCd가 변경되면 실행됨

  const fetchData = async () => {
    setLoading(true); // 로딩 시작
    try {
      // RRS에 저장된 DIE SPLIT 리스트 가져오기
      const mapGrpList = await getMapGrpList(deviceCd, layerCd);

      // 상태 리셋
      resetState(dispatch);

      if (_.isEmpty(mapGrpList)) {
        // MPS로부터 BASE MAP 좌표 리스트 가져오기
        const baseMapItemList = await getBaseMapItemList(deviceCd);
        if (!_.isEmpty(baseMapItemList)) {
          parseBaseMapItemList(baseMapItemList, dispatch);
        }
      } else {
        parseMapGrpList(mapGrpList, dispatch);
      }
    } catch (error) {
      console.error("Error during fetchData:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const handleOnClickSave = async () => {
    try {
      // RRS에 새로운 DIE SPLIT 리스트 데이터 저장
      const saveResult = await saveMapGrpList(deviceCd, layerCd, state);
      console.log("Save result:", saveResult);
    } catch (error) {
      console.error("Error during onClickSave:", error);
    }
  };

  return (
    <div>
      <h3>State Map Group List</h3>
      <ul>
        {state.stateMapGrpList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>State Item List</h3>
      <ul>
        {state.stateItemList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>State Org Item List</h3>
      <ul>
        {state.stateOrgItemList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <button onClick={fetchData} disabled={loading}>
        {loading ? "Loading..." : "Fetch Data"}
      </button>
      <button onClick={handleOnClickSave}>Save Data</button>
    </div>
  );
};

export default MyComponent;
