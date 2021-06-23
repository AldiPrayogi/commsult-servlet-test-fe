import React from 'react';
import { Table, Space, Button, message, Form, Input, Modal } from 'antd';
import userService from './services/userService';
import './App.css';
import axios from 'axios';

const defaultUser = [
  { id: 1, title: "Went Well" },
  { id: 2, title: "Action Items" }
]

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      users: defaultUser,
      value: 'test',
      openModal: false,
      updatedUser: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
  };

  getData() {
    axios.get(userService.API_URL)
      .then((response) => {
        console.log(response.data);
        this.setState({ users: response.data });
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleModalClose() {
    this.setState({ openModal: false });
    this.setState({ updatedUser: {} });
  }

  handleSubmit(value) {
    axios.post(userService.API_URL, {
      name: value.name
    })
      .then((response) => {
        message.success(response.data.message);
        this.getData();
      })
      .catch(function (error) {
        console.log(error);
      }
    )
  }

  handleUpdateSubmit(value) {
    axios.put(`${userService.API_URL}?userID=${this.state.updatedUser.userID}`, {
      name: value.name
    })
      .then((response) => {
        message.success(response.data.message);
        this.getData();
      })
      .catch(function (error) {
        console.log(error);
      }
    )
    this.handleModalClose();
  }

  deleteData(data) {
    axios.delete(`${userService.API_URL}?userID=${data.userID}`)
      .then((response) => {
        message.success(response.data.message);
        this.getData();
      })
      .catch(function (error) {
        console.log(error);
      }
    )
  }

  handleUpdateButtonClicked(data) {
    this.setState({ updatedUser: data })
    this.setState({ openModal: true });
  }

  columns = [
    {
      title: 'UserID',
      dataIndex: 'userID',
      key: 'userID'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Action',
      key: 'action',
      render: (data) => (
        <Space size="middle">
          <Button onClick={() => this.handleUpdateButtonClicked(data)}>Update</Button>
          <Button onClick={() => this.deleteData(data)}>Delete</Button>
        </Space>
      ),
    },
  ];

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div className="App">
        <div className="table">
          <Table columns={this.columns} dataSource={this.state.users} pagination={false} />
        </div>
        <div className="form">
          <Form onFinish={this.handleSubmit}>
            <Form.Item
              required
              onChange={(e) => this.handleChange(e)}
              label="Name"
              name="name"
              initialValue={this.state.value}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Modal title="Update Name" visible={this.state.openModal} onCancel={() => this.handleModalClose()} destroyOnClose footer={false}>
          <div className="form">
            <Form onFinish={this.handleUpdateSubmit} initialValues={{ name: this.state.updatedUser.name }}>
              <Form.Item
                required
                onChange={(e) => this.handleChange(e)}
                label="Name"
                name="name"
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
