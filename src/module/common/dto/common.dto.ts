type endType =
  | 'studentH5Web'
  | 'studentNativeApp'
  | 'studentNativeIOS'
  | 'studentNativeAndroid'
  | 'studentPcWeb'
  | 'node'
  | 'companionStudy';

export type logSwitchDto = {
  endType: endType;
};

type isOpenType = 1 | 0;
export type changeLogSwitchDto = {
  endType: endType;
  logSwitch: isOpenType;
};
