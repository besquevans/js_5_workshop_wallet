window.addEventListener("DOMContentLoaded", () => {
  const itemForm = window.document.forms["item-form"]
  const records_panel = window.document.querySelector("#records-panel")
  let records = []

  item_form_listener()
  record_delete_listener()
  search_record_listener()
  get_records()
  show_records(records)
  

  //listener
  function item_form_listener() {
    itemForm.addEventListener("submit", (e) => {
      e.preventDefault();
      records = get_records() || []
      //records 陣列加入新紀錄
      records.push(new_record())
      save_records(records)
      //顯示所有紀錄
      show_records(records)
      // console.log(records)
      itemForm.reset()
    })
  }

  function record_delete_listener() {
    records_panel.addEventListener("click", ({target}) => {
      if (target.className === "remove") {
        let target_record = target.parentNode.parentNode
        let records = get_records()
        // 排除目標 uuid record
        records = records.filter((r) => r.uuid !== target_record.dataset.uuid )
        // 移除 target record
        save_records(records)
        target_record.remove()
      }
    })
  }
  
  function new_record() {
    let newrecord = {
      uuid: generateUUID(),
      category: itemForm.elements.category.value,
      date: itemForm.elements.date.value,
      amount: itemForm.elements.amount.value,
      description: itemForm.elements.description.value,
    }
    // console.log(record)
    return newrecord
  }

  //records存入localStorage
  function save_records(records) {
    let json_records = JSON.stringify(records)
    localStorage.setItem('records', json_records)
  }

  //取得localStorage records
  function get_records() {
    let json_records = localStorage.getItem('records')
    //判斷local storage 是否為null
    if(json_records) {
      records = JSON.parse(json_records)
      return records
    }
  }

  function show_records(records) {
    console.log(records)
    //移除原本內容
    while (records_panel.hasChildNodes()) {
      records_panel.removeChild(records_panel.childNodes[0]);
    }
    //排序records
    records = records.sort(compare)
    //畫面加入新 records
    records.forEach(function(record){
      show_record(record)
    })
  }

  function show_record(record) {
    let t = window.document.querySelector("#record-template")
    var clone = document.importNode(t.content, true);

    // console.log(clone.dataset.uuid)
    
    clone.querySelector("tr").setAttribute('data-uuid', record.uuid)
    clone.querySelector(".category").textContent = record.category
    clone.querySelector(".date").textContent = record.date
    clone.querySelector(".amount").textContent = record.amount
    clone.querySelector(".description").textContent = record.description
    
    records_panel.appendChild(clone);
  }

  ///排序function
  function compare(a, b) {
    const date_a = a.date
    const date_b = b.date
  
    let comparison = 0;
    if (date_a < date_b) {
      comparison = 1;
    } else if (date_a > date_b) {
      comparison = -1;
    }
    return comparison;
  }

  //uuid
  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d+ Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  };

  //search 
  function search_record_listener() {
    const search_form = window.document.forms["search-form"]

    search_form.addEventListener("submit", (e) => {
      e.preventDefault();
      let select_category = search_form.elements.category.value
      let select_month = search_form.elements.month.value
      let filter_records = get_records()

      if (select_category) {
        filter_records = filter_records.filter((r) => r.category === select_category)
      }
      if (select_month) {
        filter_records = filter_records.filter((r) => r.date.match(/\d{4}\-\d{2}/)[0] === select_month)
      }
      // console.log(filter_records)
      show_records(filter_records)
    })
  }
})