<template>
  <div class="hello">
    <h2>API Integration</h2>
        <div class="select-bar">
            <select v-model="actions" @change="onChange($event)">
                <option value="" selected>All Members</option>
                <option value="current_basic">Basic Members</option>
                <option value="current_premier">Premier Members</option>
                <option value="new_monthly_basic_purchase">New Monthly Basic Puschases</option>
                <option value="monthly_basic_cancelled">Monthly Basic Cancellations</option>
                <option value="monthly_premier_purchase">Monthly Premier Purchases</option>
                <option value="premier_schedule">Premier Schedule</option>
            </select>
            <downloadexcel
                class   = "btn-default download-btn"
                :data   = "json_data"
                :fields = "json_fields"
                worksheet = "My Worksheet"
                type="csv"
                :before-generate = "startDownload"
                :name    = "filename + '.xls'">
                <mdb-icon icon="arrow-down" title="download" />
            </downloadexcel>
        </div>
    <mdb-datatable-2
        v-model="data"
        v-if="!nonDataFlag"
    />
  </div>
</template>

<script>
import { api } from '../services/api';
import downloadexcel from "vue-json-excel";
import moment from 'moment';
import { mdbDatatable2, mdbIcon } from 'mdbvue';

let now = new Date();

export default {
  name: 'Item',
  components: {
    downloadexcel,
    mdbDatatable2,
    mdbIcon
  },
  data () {
    return {
        actions: "",
        sourceData: null,
        loadingFlag: true,
        nonDataFlag: true,
        filename: "All_Members",
        data: {
            columns: [
                {
                  label: 'Subscription ID',
                  field: 'id',
                  sort: true
                },
                {
                  label: 'Recurring Items',
                  field: 'recurring',
                  sort: true
                },
                {
                  label: 'Status',
                  field: 'status',
                  sort: true
                },
                {
                  label: 'Created At',
                  field: 'created_at',
                  sort: true
                },
                {
                  label: 'Next Billing At',
                  field: 'next_billing',
                  sort: true
                }
            ],
            rows: null
        },
        json_fields: {
            'Subscription ID': 'id',
            'Recurring Items': 'recurring',
            'Status': 'status',
            'Created At': 'created_at',
            'Next Billing At': 'next_billing'
        },
        json_data: null,
        json_meta: [
            [
                {
                    'key': 'charset',
                    'value': 'utf-8'
                }
            ]
        ]
    };
  },
  methods: {
    startDownload: function () {
      window.alert('startDownload');
    },
    onChange: function (event) {
        console.log('onChange', event.target.value);
        let tables = [];
        switch (event.target.value) {
            case "current_basic":
                console.log('this.data.rows', this.data.rows);
                this.sourceData.forEach(item => {
                    if (item.subscription.billing_period_unit !== "year") {
                        if(item.subscription.status === "active" || item.subscription.status === "non_renewing") {
                            let tableItem = {};
                            tableItem["id"] = item.subscription.customer_id;
                            tableItem["status"] = item.subscription.status.toUpperCase();
                            tableItem["created_at"] = moment(item.subscription.created_at * 1000).format("DD-MM-YYYY");
                            tableItem["next_billing"] = moment(item.subscription.next_billing_at * 1000).format("DD-MM-YYYY");
                            tableItem["recurring"] = "Basic Member";
                            tables.push(tableItem);
                        }
                    }
                });
                this.data.rows = tables;
                this.json_data = tables;
                this.filename = "Current_Basic";
                console.log('new.', this.data.rows);
                break;
            case "current_premier":
                this.sourceData.forEach(item => {
                    if (item.subscription.billing_period_unit === "year") {
                        if(item.subscription.status === "active" || item.subscription.status === "non_renewing") {
                            let tableItem = {};
                            tableItem["id"] = item.subscription.customer_id;
                            tableItem["status"] = item.subscription.status.toUpperCase();
                            tableItem["created_at"] = moment(item.subscription.created_at * 1000).format("DD-MM-YYYY");
                            tableItem["next_billing"] = moment(item.subscription.next_billing_at * 1000).format("DD-MM-YYYY");
                            tableItem["recurring"] = "Premier Member";
                            tables.push(tableItem);
                        }
                    }
                });
                this.data.rows = tables;
                this.json_data = tables;
                this.filename = "Current_Premier";
                break;
            case "new_monthly_basic_purchase":
                this.sourceData.forEach(item => {
                    if (item.subscription.billing_period_unit !== "year" && (now.getMonth() === moment(item.subscription.created_at * 1000).toDate().getMonth() && now.getYear() === moment(item.subscription.created_at * 1000).toDate().getYear())) {
                        let tableItem = {};
                        tableItem["id"] = item.subscription.customer_id;
                        tableItem["status"] = item.subscription.status.toUpperCase();
                        tableItem["created_at"] = moment(item.subscription.created_at * 1000).format("DD-MM-YYYY");
                        tableItem["next_billing"] = moment(item.subscription.next_billing_at * 1000).format("DD-MM-YYYY");
                        tableItem["recurring"] = "Basic Member";
                        tables.push(tableItem);
                    }
                });
                this.data.rows = tables;
                this.json_data = tables;
                this.filename = "New_Monthly_Basic_Purchase";
                break;
            case "monthly_basic_cancelled":
                this.sourceData.forEach(item => {
                    if (item.subscription.billing_period_unit !== "year" && item.subscription.status === "cancelled" && item.subscription.billing_period === 1) {
                        let tableItem = {};
                        tableItem["id"] = item.subscription.customer_id;
                        tableItem["status"] = item.subscription.status.toUpperCase();
                        tableItem["created_at"] = moment(item.subscription.created_at * 1000).format("DD-MM-YYYY");
                        tableItem["next_billing"] = moment(item.subscription.next_billing_at * 1000).format("DD-MM-YYYY");
                        tableItem["recurring"] = "Basic Member";
                        tables.push(tableItem);
                    }
                });
                this.data.rows = tables;
                this.json_data = tables;
                this.filename = "Monthly_Basic_Cancelled";
                break;
            case "monthly_premier_purchase":
                this.sourceData.forEach(item => {
                    if (item.subscription.billing_period_unit === "year" && item.subscription.status === "cancelled" && item.subscription.billing_period === 1) {
                        let tableItem = {};
                        tableItem["id"] = item.subscription.customer_id;
                        tableItem["status"] = item.subscription.status.toUpperCase();
                        tableItem["created_at"] = moment(item.subscription.created_at * 1000).format("DD-MM-YYYY");
                        tableItem["next_billing"] = moment(item.subscription.next_billing_at * 1000).format("DD-MM-YYYY");
                        tableItem["recurring"] = "Premier Member";
                        tables.push(tableItem);
                    }
                });
                this.data.rows = tables;
                this.json_data = tables;
                this.filename = "Monthly_Premier_Purchase";
                break;
            case "premier_schedule":
                this.sourceData.forEach(item => {
                    if (item.subscription.billing_period_unit === "year" && item.subscription.billing_period === 1) {
                        let tableItem = {};
                        tableItem["id"] = item.subscription.customer_id;
                        tableItem["status"] = item.subscription.status.toUpperCase();
                        tableItem["created_at"] = moment(item.subscription.created_at * 1000).format("DD-MM-YYYY");
                        tableItem["next_billing"] = moment(item.subscription.next_billing_at * 1000).format("DD-MM-YYYY");
                        tableItem["recurring"] = "Premier Member";
                        tables.push(tableItem);
                    }
                });
                this.data.rows = tables;
                this.json_data = tables;
                this.filename = "Premier_Schedule";
                break;
            case "":
                this.sourceData.forEach(item => {
                    let tableItem = {};
                    tableItem["id"] = item.subscription.customer_id;
                    tableItem["status"] = item.subscription.status.toUpperCase();
                    tableItem["created_at"] = moment(item.subscription.created_at * 1000).format("DD-MM-YYYY");
                    tableItem["next_billing"] = moment(item.subscription.next_billing_at * 1000).format("DD-MM-YYYY");
                    tableItem["recurring"] = (item.subscription.billing_period_unit === "month") ? "Basic Member" : "Premier Member";
                    tables.push(tableItem);
                });
                this.data.rows = tables;
                this.json_data = tables;
                this.filename = "All_Members";
                break;
            default:
                break;
        }
    }
  },
  async mounted () {
    let chargerbeeData = await api.getChargebees();
    console.log('chargerbeeData', chargerbeeData);
    this.sourceData = chargerbeeData;
    let tables = [];
    // save data from chargebee
    chargerbeeData.forEach(item => {
        let tableItem = {};
        tableItem["id"] = item.subscription.customer_id;

        // check basic or premier
        if (item.subscription.billing_period_unit === "year") {
            tableItem["recurring"] = "Premier Member";
        } else {
            tableItem["recurring"] = "Basic Member";
        }

        switch (item.subscription.status) {
            case "future":
                tableItem["status"] = "FUTURE";
                break;
            case "in_trial":
                tableItem["status"] = "IN TRIAL";
                break;
            case "active":
                tableItem["status"] = "ACTIVE";
                break;
            case "non_renewing":
                tableItem["status"] = "NON RENEWING";
                break;
            case "paused":
                tableItem["status"] = "PAUSED";
                break;
            case "cancelled":
                tableItem["status"] = "CANCELLED";
                break;
            default:
                break;
        }
        tableItem["created_at"] = moment(item.subscription.created_at * 1000).format("DD-MM-YYYY");
        tableItem["next_billing"] = moment(item.subscription.next_billing_at * 1000).format("DD-MM-YYYY");
        tables.push(tableItem);
    });

    this.data.rows = tables;
    this.json_data = tables;
    if (this.data.rows.length !== 0) {
        console.log('OK');
        this.nonDataFlag = false;
    }
  }
}
</script>