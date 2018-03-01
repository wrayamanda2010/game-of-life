$(document).ready(function () {
  // GRID DIMENSIONS
  const maxRows = 20
  const maxCols = 20

  // GRID DATA STORAGE
  let activeCells = {}

  // INTERVAL TIMER ID
  let intervalID = null

  // INTERVAL PERIOD
  const intervalPeriodMS = 1000

  // SET INITIAL UI STATE
  $('#stop-tick-btn').attr('disabled', true)

  $('#dump-config-btn').click(dumpConfigBtnClick)
  $('#clear-btn').click(clearBtnClick)
  $('#one-tick-btn').click(oneTickBtnClick)
  $('#start-tick-btn').click(startTickBtnClick)
  $('#stop-tick-btn').click(stopTickBtnClick)

  // DRAW INITIAL GRID
  displayUIGrid()

  // UI GRID FUNCTIONS
  function displayUIGrid() {
    for (let i = 0; i < maxRows; i++) {
      const row = $('<tr>')
      for (let j = 0; j < maxCols; j++) {
        const cell = $('<td>')
        const rowColString = `${i},${j}`
        cell.attr('data-row-col', rowColString)
        cell.click(uiGridCellClick)
        row.append(cell)
      }
      $('#ui-grid').append(row)
    }
  }

  function populateUIGrid() {
    $('td').removeClass('on')
    Object.keys(activeCells).forEach((p) => {
      $(`td[data-row-col="${p}"]`).addClass('on')
    })
  }

  // SIMULATION FUNCTIONS
  function oneTick() {
    // THE NEW GENERATION OF CELLS
    const nextTickActiveCells = {}

    // LIVE CELLS
    for (rowColString of Object.keys(activeCells)) {
      const n = countNeighbors(rowColString)
      if (n === 2 || n === 3) {
        nextTickActiveCells[rowColString] = true
      }
    }

    // DEAD CELLS
    for (let i = 0; i < maxRows; i++) {
      for (let j = 0; j < maxCols; j++) {
        const rowColString = `${i},${j}`
        if (!(rowColString in activeCells) && countNeighbors(rowColString) === 3) {
          nextTickActiveCells[rowColString] = true
        }
      }
    }

    // POPULATE NEXT
    activeCells = nextTickActiveCells
    populateUIGrid()
  }

  function countNeighbors(rowColString) {
    let neighborCount = 0
    const n = neighborhood(rowColString)
    for (let k = 0; k < n.length; k++) {
      if (n[k] in activeCells) {
        neighborCount++
      }
    }
    return neighborCount
  }

  function neighborhood(rowColString) {
    const center = rowColString.split(',').map((x) => +x)
    const row = center[0]
    const col = center[1]

    const upRow = row > 0 ? row - 1 : maxRows - 1
    const downRow = row < maxRows - 1 ? row + 1 : 0
    const leftCol = col > 0 ? col - 1 : maxCols - 1
    const rightCol = col < maxCols -1 ? col + 1 : 0

    const north = [upRow, col]
    const south = [downRow, col]
    const east = [row, rightCol]
    const west = [row, leftCol]
    const northWest = [upRow, leftCol]
    const southWest = [downRow, leftCol]
    const southEast = [downRow, rightCol]
    const northEast = [upRow, rightCol]

    const directions = [north, south, east, west, northWest, southWest, southEast, northEast]

    return directions.map((p) => `${p[0]},${p[1]}`)
  }

  // CELL EVENT HANDLERS
  function uiGridCellClick(event) {
    event.preventDefault()
    const rowColString = $(this).attr('data-row-col')
    $(this).toggleClass('on')

    if ($(this).hasClass('on')) {
      activeCells[rowColString] = true
    }
    else {
      delete activeCells[rowColString]
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

    clearInterval(intervalID)
  }

  function oneTickBtnClick(event) {
    event.preventDefault()
    oneTick()
    console.log('oneTickBtnClick()')
  }

  function startTickBtnClick(event) {
    event.preventDefault()

    $('#dump-config-btn').attr('disabled', true)
    $('#clear-btn').attr('disabled', true)
    $('#one-tick-btn').attr('disabled', true)
    $('#start-tick-btn').attr('disabled', true)

    $('#stop-tick-btn').removeAttr('disabled')

    intervalID = setInterval(oneTick, intervalPeriodMS)
  }

  function clearBtnClick(event) {
    event.preventDefault()
    $('td').removeClass('on')
    activeCells = {}
  }

  function dumpConfigBtnClick(event) {
    event.preventDefault()
    console.log(activeCells)
  }
})
