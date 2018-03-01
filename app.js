$(document).ready(function () {
  const maxRows = 20
  const maxCols = 20
  const tickPeriodMs = 1000

  let activeCells = {}
  let intervalId = null

  // ATTACH EVENT HANDLERS
  $('#dump-config-btn').click(dumpConfigClicked)
  $('#step-btn').click(stepClicked)
  $('#clear-btn').click(clearClicked)
  $('#stop-ticking-btn').attr('disabled', true)
  $('#stop-ticking-btn').click(stopClicked)
  $('#start-ticking-btn').click(startClicked)

  // SETUP THE UI
  displayUIGrid()

  // CREATES THE INITIAL GRID
  function displayUIGrid() {
    for (let i = 0; i < maxRows; i++) {
      const row = $('<tr>')
      for (let j = 0; j < maxCols; j++) {
        const rowCol = `${i},${j}`
        const uiCell = $('<td>')
        uiCell.attr('data-row-col', rowCol)
        uiCell.click(uiCellClicked)
        row.append(uiCell)
      }
      $('#cell-table').append(row)
    }
  }

  // POPULATES THE GRID FROM THE COMPUTATION MATRIX
  function populateUIGrid() {
    $('td').removeClass('on')
    Object.keys(activeCells).forEach((p) => {
      $(`td[data-row-col="${p}"]`).addClass('on')
    })
  }

  function oneTick() {
    const nextTickActiveCells = {}

    // First, the live cells
    for (rowColString of Object.keys(activeCells)) {
      const n = countNeighbors(rowColString)
      if (n === 2 || n === 3) {
        nextTickActiveCells[rowColString] = true
      }
    }

    // Second, the dead cells
    for (let i = 0; i < maxRows; i++) {
      for (let j = 0; j < maxCols; j++) {
        const rowColString = `${i},${j}`
        if (!(rowColString in activeCells) && countNeighbors(rowColString) === 3) {
          nextTickActiveCells[rowColString] = true
        }
      }
    }

    activeCells = nextTickActiveCells
    populateUIGrid()
  }

  // EVENT HANDLERS
  function uiCellClicked(event) {
    event.preventDefault()
    const rowCol = $(this).attr('data-row-col')
    if ($(this).hasClass('on')) {
      $(this).removeClass('on')
      delete activeCells[rowCol]
    }
    else {
      $(this).addClass('on')
      activeCells[rowCol] = true
    }
  }

  function dumpConfigClicked(event) {
    event.preventDefault()
    Object.keys(activeCells).forEach((p) => console.log(`${p}: ${countNeighbors(p)}`))
  }

  function clearClicked(event) {
    event.preventDefault()
    activeCells = {}
    $('td').removeClass('on')
  }

  function startClicked(event) {
    event.preventDefault()
    $('#dump-config-btn').attr('disabled', true)
    $('#step-btn').attr('disabled', true)
    $('#clear-btn').attr('disabled', true)
    $('#stop-ticking-btn').attr('disabled', false)
    $('#start-ticking-btn').attr('disabled', true)
    intervalId = setInterval(oneTick, tickPeriodMs)
  }

  function stopClicked(event) {
    event.preventDefault()
    $('#dump-config-btn').attr('disabled', false)
    $('#step-btn').attr('disabled', false)
    $('#clear-btn').attr('disabled', false)
    $('#stop-ticking-btn').attr('disabled', true)
    $('#start-ticking-btn').attr('disabled', false)
    clearInterval(intervalId  )
  }

  function stepClicked(event) {
    event.preventDefault()
    oneTick()
  }

  function countNeighbors(rowColString) {
    let count = 0
    const hood = neighborhood(rowColString)
    for (x of hood) {
      if (x in activeCells) {
        count++
      }
    }
    return count
  }

  function neighborhood(rowColString) {
    const center = rowColString.split(',').map((x) => +x)

    const upRow = center[0] > 0 ? center[0] - 1 : maxRows - 1
    const downRow = center[0] < maxRows - 1 ? center[0] + 1 : 0
    const leftCol = center[1] > 0 ? center[1] - 1 : maxCols - 1
    const rightCol = center[1] < maxCols - 1 ? center[1] + 1 : 0

    const north = [upRow, center[1]]
    const south = [downRow, center[1]]
    const east = [center[0], rightCol]
    const west = [center[0], leftCol]
    const northWest = [upRow, leftCol]
    const southWest = [downRow, leftCol]
    const southEast = [downRow, rightCol]
    const northEast = [upRow, rightCol]

    const directions = [north, south, east, west, northWest, southWest, southEast, northEast]

    return directions.map((p) => `${p[0]},${p[1]}`)
  }
})
