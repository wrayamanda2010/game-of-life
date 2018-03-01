$(document).ready(function () {
const maxRows = 20
const maxCols = 20
  // SET INITIAL UI STATE
  $('#stop-tick-btn').attr('disabled', true)

  $('#dump-config-btn').click(dumpConfigBtnClick)
  $('#clear-btn').click(clearBtnClick)
  $('#one-tick-btn').click(oneTickBtnClick)
  $('#start-tick-btn').click(startTickBtnClick)
  $('#stop-tick-btn').click(stopTickBtnClick)

  displayUIGrid()

    // UI GRID FUNCTIONS
    function displayUIGrid() {
      for (let i = 0; i < maxRows; i++) {
        const row = $('<tr>')
        for (let j = 0; j < maxCols; j++) {
          const cell = $('<td>')
          row.append(cell)
        }
        $('#ui-grid').append(row)
      }
    }

  // BUTTON EVENT HANDLERS
  function stopTickBtnClick(event) {
    event.preventDefault()

    $('#dump-config-btn').removeAttr('disabled')
    $('#clear-btn').removeAttr('disabled')
    $('#one-tick-btn').removeAttr('disabled')
    $('#start-tick-btn').removeAttr('disabled')

    $('#stop-tick-btn').attr('disabled', true)

    console.log('stopBtnClick()')
  }

  function oneTickBtnClick(event) {
    event.preventDefault()
    console.log('oneTickBtnClick()')
  }

  function startTickBtnClick(event) {
    event.preventDefault()

    $('#dump-config-btn').attr('disabled', true)
    $('#clear-btn').attr('disabled', true)
    $('#one-tick-btn').attr('disabled', true)
    $('#start-tick-btn').attr('disabled', true)

    $('#stop-tick-btn').removeAttr('disabled')

    console.log('startTickBtnClick()')
  }

  function clearBtnClick(event) {
    event.preventDefault()
    console.log('clearBtnClick()')
  }

  function dumpConfigBtnClick(event) {
    event.preventDefault()
    console.log('dumpConfigBtnClick()')
  }
})
