import { Col, Pagination, Row, Slider, Form, Input, Button, Tabs, Radio } from "antd";
import $ from "jquery";
import { Component, default as React } from "react";
import { Link } from "react-router-dom";
import BreadCumb from "../../Component/Breadcumb";
import Header from "../../Component/Header";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {
  listVacine,
  getRateVaccine,
  getRiskClassification,
  listAddRiskClassification,
} from "../../networking/Server";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Table, Tag, Space } from 'antd';
import './style.css'

const productPageSize = 24;
const { Search } = Input;
const { TabPane } = Tabs;

let dataFilter = {
  text: '',
  page: 0,
  min_price: 0,
  max_price: 0,
  type_product: '',
  manufacturer: ''
}

class SearchCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemHeight: null,
      dataProvinces: [],
      dataVaccines: [],
      dataVaccinesProvinces: [],
      dataProvincesRate: [],
      dataVaccinesRate: [],
      dataVaccinesPopulation: [],
      dataVaccinesProvincesSort: [],
      dataRiskClassification: [],
      dataRiskResponse: null,
      level: [
        { name: 'Thấp', value: 1, color: 'green' },
        { name: 'Trung bình', value: 2, color: 'yellow' },
        { name: 'Cao', value: 3, color: 'orange' },
        { name: 'Rất cao', value: 4, color: 'red' },
      ]
    };
  }

  componentDidMount() {
    getRateVaccine().then(res => {
      const data = res?.result?.dataset?.vaccinated ? res?.result?.dataset?.vaccinated?.map(item => Number(item)) : []
      const data1 = res?.result?.dataset?.population ? res?.result?.dataset?.population?.map(item => Number(item)) : []
      this.setState({
        dataProvincesRate: res?.result?.label ?? [],
        dataVaccinesRate: data,
        dataVaccinesPopulation: data1,
      })
    })
    getRiskClassification().then(res => {
      this.setState({
        dataRiskClassification: res?.result ?? [],
      })
    })
  }

  onFinish = (values) => {
    const { dataProvinces, dataVaccines } = this.state
    console.log('values:', values);
    let data = {
      vaccineCount: Number(values.vaccineCount)
    }
    if (Number(values.vaccine1) > 0 && Number(values.vaccine2) > 0 && Number(values.vaccine3) > 0 && Number(values.vaccine4) > 0 && Number(values.vaccine5) > 0) {
      data.weight = [Number(values.vaccine1), Number(values.vaccine2), Number(values.vaccine3), Number(values.vaccine4), Number(values.vaccine5)]
    }
    listVacine(data).then(res => {
      const data = res?.result?.provinces?.map((item, index) => ({
        name: item,
        y: res?.result?.vaccines?.[index]
      }))

      let data1 = data ? [...data] : []
      data1.sort(function (a, b) { return b.y - a.y })
      this.setState({
        dataProvinces: res?.result?.provinces ?? [],
        dataVaccines: res?.result?.vaccines ?? [],
        dataVaccinesProvinces: data,
        dataVaccinesProvincesSort: data1
      })
    })
    console.log('data:', data);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  onFinishRisk = (values) => {
    const { dataRiskClassification } = this.state
    console.log('values:', values);
    let data = {
      national_id: dataRiskClassification?.length > 0 ? `${Number(dataRiskClassification[dataRiskClassification?.length - 1]?.national_id) + 1}` : `${Math.floor(Math.random() * 1000)}`,
      name: values.name,
      age: Number(values.age),
      vaccine_dose: Number(values.vaccine_dose),
      background_disease: Number(values.background_disease),
      symptoms: Number(values.symptoms),
      blood_oxygen: Number(values.blood_oxygen),
      emergency: Number(values.emergency),
      pregnant: Number(values.pregnant)
    }
    listAddRiskClassification(data).then(res => {
      console.log('res: ', res);
      getRiskClassification().then(res1 => {
        this.setState({
          dataRiskClassification: res1?.result ?? [],
          dataRiskResponse: res?.result?.risk_level ?? '',
        })
      })
    })
    console.log('data:', data);
  };

  onFinishFailedRisk = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const { dataProvinces, dataVaccines, dataVaccinesProvinces, dataProvincesRate, dataVaccinesRate, dataVaccinesPopulation, dataVaccinesProvincesSort, dataRiskClassification, dataRiskResponse, level } = this.state
    const columns = [
      {
        title: 'Tỉnh/Thành phố',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Phân bổ vaccine',
        dataIndex: 'y',
        key: 'y',
      },
    ];

    const columns1 = [
      {
        title: 'Họ tên',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Tuổi',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Số mũi đã tiêm',
        dataIndex: 'vaccine_dose',
        key: 'vaccine_dose',
      },
      {
        title: 'Chỉ số SpO2 (Blood Oxygen Level)',
        dataIndex: 'blood_oxygen',
        key: 'blood_oxygen',
      },
      {
        title: 'Bệnh lý nền',
        dataIndex: 'background_disease',
        key: 'background_disease',
        render: text => text === 1 ? 'Có' : 'Không',
      },
      {
        title: 'Các triệu chứng',
        dataIndex: 'symptoms',
        key: 'symptoms',
        render: text => text === 1 ? 'Có' : 'Không',
      },
      {
        title: 'Tình trạng cấp cứu',
        dataIndex: 'emergency',
        key: 'emergency',
        render: text => text === 1 ? 'Có' : 'Không',
      },
      {
        title: 'Phụ nữ mang thai',
        dataIndex: 'pregnant',
        key: 'pregnant',
        render: text => text === 1 ? 'Có' : 'Không',
      },
      {
        title: 'Mức độ nguy cơ',
        dataIndex: 'risk_level',
        key: 'risk_level',
        render: text => <span style={{ color: level?.find(item => item.value === text)?.color ?? 'unset' }}>{level?.find(item => item.value === text)?.name ?? ''}</span>,
      },
    ];

    const data = [
      {
        key: '1',
        name: 'Hà Nội',
        age: 100000,
        address: 50000,
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Hồ Chí Minh',
        age: 200000,
        address: 100000,
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Bình Dương',
        age: 100000,
        address: 500000,
        tags: ['cool', 'teacher'],
      },
    ];
    console.log('aaaa: ', dataVaccinesProvinces);
    return (
      <Tabs defaultActiveKey="1" style={{ padding: '8px' }}>
        <TabPane tab="Phân bổ vaccine" key="1">
          <div style={{ padding: '32px 16px' }}>
            <Row>
              <Col span={12} style={{ border: '1px solid', padding: '16px', borderRadius: '5px' }}>
                <Row>
                  <Col span={24}>
                    <Form
                      name="basic"
                      layout="vertical"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      initialValues={{ remember: true }}
                      onFinish={this.onFinish}
                      onFinishFailed={this.onFinishFailed}
                      autoComplete="off"
                    >
                      <Row>
                        <Col span={16}>
                          <div style={{ fontSize: "18px", fontWeight: 'bold' }}>Bắt buộc</div>
                          <Form.Item
                            label="Số mũi tiêm"
                            name="vaccineCount"
                            rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <div style={{ fontSize: "18px", fontWeight: 'bold' }}>Tùy chọn trọng số</div>
                          <Row>
                            <Col span={12}>
                              <Form.Item
                                label="Cấp độ dịch"
                                name="vaccine1"
                              >
                                <Input type="number" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Tỷ lệ tiêm một mũi"
                                name="vaccine2"
                              >
                                <Input type="number" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Tỷ lệ tiêm chủng"
                                name="vaccine3"
                              >
                                <Input type="number" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Tỷ lệ đã phân bổ"
                                name="vaccine4"
                              >
                                <Input type="number" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Tỷ lệ dự kiến phân bổ"
                                name="vaccine5"
                              >
                                <Input type="number" />
                              </Form.Item>
                            </Col>
                            {/* <Col span={12}>
                          <Form.Item
                            label="Cấp độ dịch"
                            name="level"
                          >
                            <Input type="number" />
                          </Form.Item>
                        </Col> */}
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Form.Item style={{ paddingTop: '24px' }}>
                            <Button type="primary" htmlType="submit">
                              Phân bố
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </Col>
              <Col span={12} style={{ padding: '16px', overflow: 'auto', height: '500px' }}>
                <HighchartsReact
                  // allowChartUpdate={keyCounting}
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'bar',
                      height: 1500,
                    },
                    title: {
                      text: 'Thống kê vaccine đã tiêm'
                    },
                    // subtitle: {
                    //   text: 'Source: WorldClimate.com'
                    // },
                    xAxis: {
                      categories: [...dataProvincesRate],
                      crosshair: true
                    },
                    yAxis: {
                      min: 0,
                      title: {
                        text: 'Người'
                      }
                    },
                    tooltip: {
                      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                      footerFormat: '</table>',
                      shared: true,
                      useHTML: true
                    },
                    plotOptions: {
                      column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                      }
                    },
                    series: [{
                      name: 'Số vaccine đã tiêm',
                      data: [...dataVaccinesRate]

                    }
                      , {
                      name: 'Dân số',
                      data: [...dataVaccinesPopulation]

                    }
                    ]
                  }}
                />
              </Col>
              {dataVaccinesProvinces?.length > 0 && <Col span={12} style={{ padding: '16px', marginTop: '16px', overflow: 'auto', height: '500px' }}>
                <Table
                  columns={columns}
                  dataSource={dataVaccinesProvincesSort}
                  pagination={false}
                />
              </Col>}
              {dataVaccinesProvinces?.length > 0 && <Col span={12} style={{ padding: '16px' }}>
                <HighchartsReact
                  // allowChartUpdate={keyCounting}
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      plotBackgroundColor: null,
                      plotBorderWidth: null,
                      plotShadow: false,
                      type: 'pie'
                    },
                    title: {
                      text: 'Biểu đồ phân bố vaccine'
                    },
                    tooltip: {
                      pointFormat: '{series.name}: {point.y}</b>'
                    },
                    accessibility: {
                      point: {
                        valueSuffix: '%'
                      }
                    },
                    plotOptions: {
                      pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                          enabled: true,
                          format: '<b>{point.name}</b>: {point.y}'
                        }
                      }
                    },
                    series: [{
                      name: 'Brands',
                      colorByPoint: true,
                      data: [...dataVaccinesProvinces]
                    }]
                  }}
                />
              </Col>}
            </Row>
          </div>
        </TabPane>
        <TabPane tab="Phân loại nguy cơ" key="2">
          <div style={{ padding: '32px 16px' }}>
            <Row>
              <Col span={12} style={{ border: '1px solid', padding: '16px', borderRadius: '5px' }}>
                <Row>
                  <Col span={24}>
                    <Form
                      name="basic"
                      layout="vertical"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      initialValues={{ remember: true }}
                      onFinish={this.onFinishRisk}
                      onFinishFailed={this.onFinishFailedRisk}
                      autoComplete="off"
                    >
                      <Row>
                        {/* <Col span={16}>
                          <div style={{ fontSize: "18px", fontWeight: 'bold' }}>Bắt buộc</div>
                          <Form.Item
                            label="Số mũi tiêm"
                            name="vaccineCount"
                            rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col> */}
                        <Col span={24}>
                          {/* <div style={{ fontSize: "18px", fontWeight: 'bold' }}>Tùy chọn trọng số</div> */}
                          <Row>
                            <Col span={12}>
                              <Form.Item
                                label="Họ tên"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Tuổi"
                                name="age"
                                rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
                              >
                                <Input type="number" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Số mũi đã tiêm"
                                name="vaccine_dose"
                                rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
                              >
                                <Input type="number" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Chỉ số SpO2 (Blood Oxygen Level)"
                                name="blood_oxygen"
                                rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
                              >
                                <Input type="number" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Bệnh lý nền"
                                name="background_disease"
                                rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
                              >
                                <Radio.Group>
                                  <Radio value="1">Có</Radio>
                                  <Radio value="0">Không</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Các triệu chứng"
                                name="symptoms"
                                rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
                              >
                                <Radio.Group>
                                  <Radio value="1">Có</Radio>
                                  <Radio value="0">Không</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Tình trạng cấp cứu"
                                name="emergency"
                                rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
                              >
                                <Radio.Group>
                                  <Radio value="1">Có</Radio>
                                  <Radio value="0">Không</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Phụ nữ mang thai"
                                name="pregnant"
                                rules={[{ required: true, message: 'Vui lòng nhập thông tin' }]}
                              >
                                <Radio.Group>
                                  <Radio value="1">Có</Radio>
                                  <Radio value="0">Không</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </Col>
                            {/* <Col span={12}>
                          <Form.Item
                            label="Cấp độ dịch"
                            name="level"
                          >
                            <Input type="number" />
                          </Form.Item>
                        </Col> */}
                          </Row>
                        </Col>
                        <Col span={24} style={{ display: 'flex' }}>
                          <Form.Item style={{ paddingTop: '24px' }}>
                            <Button type="primary" htmlType="submit">
                              Phân loại nguy cơ
                            </Button>
                          </Form.Item>
                          {dataRiskResponse &&
                            <div style={{ marginLeft: '48px', alignSelf: 'center', color: level?.find(item => item.value === dataRiskResponse)?.color ?? 'unset' }}>
                              Mức độ nguy cơ: {level?.find(item => item.value === dataRiskResponse)?.name ?? ''}
                            </div>}
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </Col>
              <Col span={24} style={{ padding: '16px', marginTop: '16px', overflow: 'auto', height: '1000px' }}>
                <Table
                  columns={columns1}
                  dataSource={dataRiskClassification}
                  pagination={false}
                />
              </Col>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    );
  }
}
export default SearchCar;
