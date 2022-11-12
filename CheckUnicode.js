/**
 * 第一位，登记管理部门:
 * 机构编制	1
 * 外交	2
 * 司法行政	3
 * 文化	4
 * 民政	5
 * 旅游	6
 * 宗教	7
 * 工会	8
 * 工商	9
 * 中央军委改革和编制办公室	A
 * 农业	N
 * 其他	Y
 */
const registration = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "N",
  "Y",
];

const department = {
  /** 机构编制:机关,事业单位,编办直接管理机构编制的群众团体,其他 */
  1: [1, 2, 3, 9],
  /** 外交: 外国常驻新闻机构,其他 */
  2: [1, 9],
  /** 司法行政: 律师执业机构,公证处,基层法律服务所,司法鉴定机构,仲裁委员会,其他 */
  3: [1, 2, 3, 4, 5, 9],
  /** 文化:外国在华文化中心,其他 */
  4: [1, 9],
  /** 民政:社会团体,民办非企业单位,基金会,其他 */
  5: [1, 2, 3, 9],
  /** 旅游:外国旅游部门常驻代表机构,港澳台地区旅游部门常驻内地（大陆）代表机构,其他 */
  6: [1, 2, 9],
  /** 宗教:宗教活动场所,宗教院校,其他 */
  7: [1, 2, 9],
  /** 工会: 基层工会,其他 */
  8: [1, 9],
  /** 工商: 企业,个体工商户,农民专业合作社 */
  9: [1, 2, 3],
  /** 中央军委改革和编制办公室: 军队事业单位,其他 */
  A: [1, 9],
  /** 农业:组级集体经济组织,村级集体经济组织,乡镇级集体经济组织,其他 */
  N: [1, 2, 3, 9],
  /** 其他 */
  Y: [1],
};

/** 用于存放权值 */
const Weight = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];

/** 统一社会信用代码字符串与数字的对应关系 */
const UnicodeChar2num = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
  G: 16,
  H: 17,
  J: 18,
  K: 19,
  L: 20,
  M: 21,
  N: 22,
  P: 23,
  Q: 24,
  R: 25,
  T: 26,
  U: 27,
  W: 28,
  X: 29,
  Y: 30,
};

/** 允许使用的字符集合 */
const charKeys = Object.keys(UnicodeChar2num);

/**
 * 校验统一社会信用代码
 * @param {string} unicode 统一社会信用代码
 * @returns 
 */
export const isUnicode = (unicode) => {
  // 校验是否为字符串
  if (typeof unicode !== "string") {
    return false;
  }

  // 长度是否为18位
  if (unicode.length !== 18) {
    return false;
  }

  // 判断首位是否正确
  const first = unicode[0];
  if (!registration.includes(first)) {
    return false;
  }

  // 判断第2位是否正确
  const second = Number(unicode[1]);
  if (!department[first].includes(second)) {
    return false;
  }

  // 判断第3~8位为行政区划编码
  const administrative = unicode.slice(2, 8);
  if (!/^\d{6}$/g.test(administrative)) {
    return false;
  }
  // 判断第9~17位组织机构代码
  const organization = unicode.slice(8, 17);
  if (!organization.split("").every((v) => charKeys.includes(v))) {
    return false;
  }

  // 按照GB/T 17710标准对统一社会信用代码前17位计算校验码，并与第18位校验位进行比对

  /** 用于存放代码字符和加权因子乘积之和 */
  const tempSum = Weight.map((weight, index) => {
    /** 字符对应的数字 */
    const num = UnicodeChar2num[unicode[index]];
    return weight * num;
  }).reduce((a, b) => a + b);
  /** 校验码 */
  const checkCode = (31 - (tempSum % 31)) % 31;

    
  return checkCode === UnicodeChar2num[unicode[17]];
};


export default isUnicode