import { Col, Pagination, Row, Slider, Form, Input, Button } from "antd";
import $ from "jquery";
import { Component, default as React } from "react";
import { Link } from "react-router-dom";
import BreadCumb from "../../Component/Breadcumb";
import Header from "../../Component/Header";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {
  listVacine,
  getRateVaccine
} from "../../networking/Server";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Table, Tag, Space } from 'antd';
import './style.css'

const productPageSize = 24;
const { Search } = Input;

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
      dataVaccinesProvincesSort: []
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

  render() {
    const { dataProvinces, dataVaccines, dataVaccinesProvinces, dataProvincesRate, dataVaccinesRate, dataVaccinesPopulation, dataVaccinesProvincesSort } = this.state
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
    );
  }
}
export default SearchCar;
