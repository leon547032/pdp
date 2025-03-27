TODO
--------------------------------------------------------- '동일 신청서 내 레이어 복사' ---------------------------------------------------------
신청서1
    Layer-11 (현재 열려있는 DieSplit모달)
        * Map그룹-A11
            - DieSplit
        * Map그룹-B11
            - DieSplit
    Layer-12 (복사할 레이어)
        * Map그룹-C12
            - DieSplit
        * Map그룹-D12
            - DieSplit

'동일 신청서 내 레이어 복사'시에 Layer-12을 선택해서 복사하면 Layer-12 하위에 모든 Map그룹들을 Layer-11쪽으로 추가해서 가져오는건지? (아래 데이터 구조) 

신청서-1
    Layer-11 (현재 열려있는 DieSplit모달)
        * Map그룹-A11
            - DieSplit
        * Map그룹-B11
            - DieSplit
        * Map그룹-C12 (추가)
            - DieSplit
        * Map그룹-D12 (추가)
            - DieSplit

아니면 Layer-11의 기존 Map그룹들이 버려지고 Layer-12 하위의 Map그룹 전체를 복사해오는건지? (아래 데이터 구조) 

신청서-1
    Layer-11 (현재 열려있는 DieSplit모달)
        * Map그룹-C12 (추가)
            - DieSplit
        * Map그룹-D12 (추가)
            - DieSplit


------------------------------------------------------------------------------------------------------------------------------------
const getBaseMapInfo = async (deviceCd) => {
  try {
    const response = await axios.get(`https://your-api-endpoint.com/baseMapData`, {
      params: { deviceCd }
    });
    return response.data.baseMapData; // 응답에서 필요한 데이터를 리턴
  } catch (error) {
    console.error('Error fetching base map data:', error);
    throw error; // 에러 발생 시 에러를 던져서 호출한 곳에서 처리하도록 할 수 있습니다.
  }
};

------------------------------------------------------------------------------------------------------------------------------------



- getBaseMapItemList(deviceCd)
- getDieSplitList(deviceCd, layerCd)


stateMapGrpList
- dataItemList
- dataOrgItemList



const initialState = {
    stateMapGrpList: [],
    stateItemList: [],
    stateOrgItemList: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_MAP_GRP':
            return { ...state, stateMapGrpList: [...state.stateMapGrpList, action.payload] };
        default:
            return state;
    }
};

const parseMapGrpList = (mapGrpList) => {
    mapGrpList.forEach((mapGrp) => {
        dispatch({ type: 'ADD_MAP_GRP', payload: mapGrp });
    });
};


const mapGrpList = getDieSplitList(deviceCd, layerCd);
RESET_STATE();
if (_.isEmpty(mapGrpList)) {
    const baseMapItemList = getBaseMapItemList(deviceCd);
    if (!_.isEmpty(baseMapItemList)) {
        SET_DATA_ITEM_LIST(baseMapItemList);
        dispatch({ type: 'ADD_ITEM', payload: mapGrp });
        SET_DATA_ITEM_ORG_LIST(baseMapItemList);
        dispatch({ type: 'ADD_ITEM_OR', payload: mapGrp });
    }
} else {
    mapGrpList.forEach((mapGrp) => {
        dispatch({ type: 'ADD_MAP_GRP', payload: mapGrp });
        mapGrp.forEach((item) => {
            dispatch({ type: 'ADD_ITEM', payload: item });
        });
    });
}










