import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  Menu,
  ListItemText,
  MenuItem,
  List,
  TablePagination,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'

// Sample data structure - this would come from the agent
const initialData = Array.from({ length: 35 }, (_v, idx) => {
  const n = idx + 1
  const sev = (idx % 4) + 1
  const priority = idx % 2 === 0 ? 'High' : 'Medium'
  const cat = idx % 2 === 0 ? 'Availability' : 'Resolution'
  const subcat = cat === 'Availability' ? 'Response Time' : 'Time to Resolve'
  const maxMinutes = 60 + idx * 5
  const maxHours = 4 + idx
  const isTimeInMinutes = idx % 3 === 0
  return {
    id: n,
    sNo: n,
    title: `Severity Level ${sev} ${cat}`,
    lineOfBusiness: 'Managed Services',
    programProject: 'Skype Managed Services',
    serviceLevelId: `SL${String(n).padStart(4, '0')}`,
    documentName: 'EXHIBIT B',
    serviceLevelDescription:
      cat === 'Availability'
        ? `Respond to Severity Level ${sev} incidents within ${maxMinutes} minutes`
        : `Resolve Severity Level ${sev} incidents within ${maxHours} hours`,
    slType: 'SL',
    slCategory: cat,
    slSubcategory: subcat,
    priority,
    unitOfMeasurement: isTimeInMinutes ? 'Minutes' : 'Hours',
    minOrMax: 'Maximum',
    expectedTargetValue: isTimeInMinutes ? `${maxMinutes}` : `${maxHours}`,
    thresholdValueFloor: isTimeInMinutes ? `${maxMinutes + 30}` : `${maxHours + 6}`,
    thresholdValueBasement: isTimeInMinutes ? `${maxMinutes + 60}` : `${maxHours + 12}`,
    measurementWindow: 'Per incident',
    computationFrequency: 'Monthly',
    exclusions: 'Planned maintenance and force majeure',
    slCreditApplicable: 'Yes',
    slCreditClauseDescription: 'Credits applied beyond threshold defaults',
    slCreditMode: 'Percent of monthly charges',
    slCreditFormula: '5% of monthly charge per default beyond threshold',
    slCreditFrequency: 'Monthly',
    earnbackApplicable: idx % 3 === 0 ? 'Yes' : 'No',
    earnbackClauseDescription: idx % 3 === 0 ? 'Earnback if 2 consecutive months meet target' : 'N/A',
    earnbackMode: idx % 3 === 0 ? 'Credit reversal' : 'N/A',
    earnbackFrequency: idx % 3 === 0 ? 'Monthly' : 'N/A',
    serviceLevelDefault: 'Exceeded committed time',
    persistentDefaultClause: 'Defaults in consecutive months trigger RCA',
    terminationTrigger: 'Repeated defaults may trigger termination review',
    slStartDate: '2024-01-01',
    slEndDates: '2025-12-31',
    slEffectiveDate: '2024-02-01',
    reportingFrequency: 'Monthly',
    slOwner: 'Service Delivery',
    slApprover: 'Client Ops',
    supplierResponsibility: 'Yes',
  }
})

const columns = [
  { id: 'sNo', label: 'Sno', minWidth: 70, defaultWidth: 80 },
  { id: 'title', label: 'Title / SL Name', minWidth: 200, defaultWidth: 220 },
  { id: 'lineOfBusiness', label: 'Line of Business (LOB)', minWidth: 160, defaultWidth: 180 },
  { id: 'programProject', label: 'Program/ Project', minWidth: 180, defaultWidth: 200 },
  { id: 'serviceLevelId', label: 'Service Level ID (SL ID)', minWidth: 160, defaultWidth: 180 },
  { id: 'documentName', label: 'Document Name/ID', minWidth: 150, defaultWidth: 170 },
  { id: 'serviceLevelDescription', label: 'Service Level Description', minWidth: 320, defaultWidth: 340 },
  { id: 'slType', label: 'SL Type', minWidth: 100, defaultWidth: 120 },
  { id: 'slCategory', label: 'SL Category', minWidth: 140, defaultWidth: 160 },
  { id: 'slSubcategory', label: 'SL Subcategory', minWidth: 150, defaultWidth: 170 },
  { id: 'priority', label: 'Priority', minWidth: 100, defaultWidth: 120 },
  { id: 'unitOfMeasurement', label: 'Unit of Measurement', minWidth: 150, defaultWidth: 170 },
  { id: 'minOrMax', label: 'Minimum/ Maximum?', minWidth: 140, defaultWidth: 160 },
  { id: 'expectedTargetValue', label: 'Expected/Target Value', minWidth: 150, defaultWidth: 170 },
  { id: 'thresholdValueFloor', label: 'Threshold Value (Floor)', minWidth: 170, defaultWidth: 190 },
  { id: 'thresholdValueBasement', label: 'Threshold Value 2 (Basement)', minWidth: 200, defaultWidth: 220 },
  { id: 'measurementWindow', label: 'Measurement Window', minWidth: 150, defaultWidth: 170 },
  { id: 'computationFrequency', label: 'Computation Frequency', minWidth: 170, defaultWidth: 190 },
  { id: 'exclusions', label: 'Exclusions', minWidth: 180, defaultWidth: 200 },
  { id: 'slCreditApplicable', label: 'SL Credit Applicable?', minWidth: 170, defaultWidth: 190 },
  { id: 'slCreditClauseDescription', label: 'SL Credit Clause Description', minWidth: 220, defaultWidth: 240 },
  { id: 'slCreditMode', label: 'SL Credit Mode', minWidth: 150, defaultWidth: 170 },
  { id: 'slCreditFormula', label: 'SL Credit Formula', minWidth: 200, defaultWidth: 220 },
  { id: 'slCreditFrequency', label: 'SL Credit Frequency', minWidth: 170, defaultWidth: 190 },
  { id: 'earnbackApplicable', label: 'Earnback Applicable?', minWidth: 170, defaultWidth: 190 },
  { id: 'earnbackClauseDescription', label: 'Earnback Clause Description', minWidth: 220, defaultWidth: 240 },
  { id: 'earnbackMode', label: 'Earnback Mode', minWidth: 150, defaultWidth: 170 },
  { id: 'earnbackFrequency', label: 'Earnback Frequency', minWidth: 170, defaultWidth: 190 },
  { id: 'serviceLevelDefault', label: 'Service Level Default', minWidth: 200, defaultWidth: 220 },
  { id: 'persistentDefaultClause', label: 'Persistent Default Clause', minWidth: 220, defaultWidth: 240 },
  { id: 'terminationTrigger', label: 'Termination Trigger', minWidth: 200, defaultWidth: 220 },
  { id: 'slStartDate', label: 'SL Start Date', minWidth: 140, defaultWidth: 150 },
  { id: 'slEndDates', label: 'SL End Dates', minWidth: 140, defaultWidth: 150 },
  { id: 'slEffectiveDate', label: 'SL Effective Date', minWidth: 150, defaultWidth: 160 },
  { id: 'reportingFrequency', label: 'Reporting Frequency', minWidth: 160, defaultWidth: 180 },
  { id: 'slOwner', label: 'SL Owner', minWidth: 140, defaultWidth: 150 },
  { id: 'slApprover', label: 'SL Approver', minWidth: 140, defaultWidth: 150 },
  { id: 'supplierResponsibility', label: 'Supplier Responsibility?', minWidth: 170, defaultWidth: 190 },
]

// Enable filtering on all columns
const taxonomyFields = columns.map((c) => c.id)

const aiInsights = [
  'Amount at Risk: 15% of Charges (excluding out-of-pocket expenses) per month.',
  'Credit Calculation: Each Service Level assigned % credit allocation. Credits for Defaults = SL Allocation % x Amount at Risk. Max credits/month capped at full Amount at Risk. Regional allocation for availability.',
  'Earnback: Not specified in the contract.',
  'Termination: Sirion may terminate if same Service Level missed 3 consecutive months or 4 in 12 months. 30 days\' written notice after right arises.',
  'Default and Additional Remedies: Credits are sole remedy unless Service Level Floor breached or all credits for month triggered; in those cases, direct damages up to liability cap also available. Service Level Default defined as failure to meet SL, with specific exceptions.',
]

const references = [
  'Exhibit B SERVICE LEVELS',
  'Attachment B-1 to Exhibit B Service Level Metrics',
  'Attachment B-2 to Exhibit B Vendor Severity Rating to SIRION Priority Crosswalk',
  'Exhibit C CHARGES',
  'Exhibit A PROJECT SERVICES',
  'Annex 1',
  'Exhibit D GOVERNANCE',
]

// Filter Menu Component anchored to the filter button
function FilterMenu({ anchorEl, open, onClose, columnId, data, column }) {
  if (!open || !anchorEl) return null

  const rect = anchorEl.getBoundingClientRect()
  const anchorPosition = {
    top: rect.bottom + (window.scrollY || window.pageYOffset),
    left: rect.left + (window.scrollX || window.pageXOffset),
  }

  return (
    <Menu
      // Use computed screen coordinates to avoid any portal/scroll misalignment
      anchorEl={anchorEl}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      open
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      disablePortal
      keepMounted
      MenuListProps={{ dense: true, sx: { maxHeight: 300, minWidth: 180 } }}
      slotProps={{
        paper: {
          sx: { overflowY: 'auto' },
          elevation: 3,
        },
      }}
    >
      <MenuItem onClick={onClose}>
        <ListItemText>All</ListItemText>
      </MenuItem>
      {Array.from(new Set(data.map((row) => row[column.id])))
        .filter((val) => val && val !== '-')
        .map((value) => (
          <MenuItem key={value} onClick={onClose}>
            <ListItemText>{value}</ListItemText>
          </MenuItem>
        ))}
    </Menu>
  )
}

function SLExtractionTable() {
  const [data, setData] = useState(initialData)
  const [selected, setSelected] = useState([])
  const [retriggerDialog, setRetriggerDialog] = useState({ open: false, type: null, target: null })
  const [instructions, setInstructions] = useState('')
  const [filterMenus, setFilterMenus] = useState({})
  const filterButtonRefs = useRef({})
  const [page, setPage] = useState(0)
  const computeInitialWidth = (col) =>
    Math.max(col.defaultWidth || 140, (col.label?.length || 8) * 8 + 48) // room for text + icons

  const [columnWidths, setColumnWidths] = useState(
    columns.reduce((acc, col) => {
      acc[col.id] = computeInitialWidth(col)
      return acc
    }, {})
  )

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(data.map((row) => row.id))
    } else {
      setSelected([])
    }
  }

  const handleSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleDeleteRow = (id) => {
    setData(data.filter((row) => row.id !== id))
    setSelected(selected.filter((selectedId) => selectedId !== id))
  }

  const handleDeleteSelected = () => {
    setData(data.filter((row) => !selected.includes(row.id)))
    setSelected([])
  }

  const handleRetriggerExtraction = (type, target = null) => {
    setRetriggerDialog({ open: true, type, target })
  }

  const handleRetriggerSubmit = () => {
    // Here you would send the instructions to the agent
    console.log('Retrigger extraction:', {
      type: retriggerDialog.type,
      target: retriggerDialog.target,
      instructions,
    })
    setRetriggerDialog({ open: false, type: null, target: null })
    setInstructions('')
    // In a real implementation, you would call an API to retrigger extraction
  }

  const handleFilterClick = (event, columnId) => {
    event.preventDefault()
    event.stopPropagation()
    // Get the button element - currentTarget is the IconButton
    const button = event.currentTarget
    console.log('Filter button clicked:', button, 'Column:', columnId)
    // Verify it's a valid DOM element
    if (button && button instanceof HTMLElement) {
      console.log('Button position:', button.getBoundingClientRect())
      setFilterMenus((prev) => ({
        ...prev,
        [columnId]: button,
      }))
    }
  }

  const handleFilterClose = (columnId) => {
    setFilterMenus({
      ...filterMenus,
      [columnId]: null,
    })
  }

  const handleSubmit = () => {
    const tableData = {
      rows: data,
      metadata: {
        timestamp: new Date().toISOString(),
        totalRows: data.length,
      },
    }
    console.log('Submitting table data:', JSON.stringify(tableData, null, 2))
    // In a real implementation, you would send this to the agent
    alert('Table data submitted! Check console for JSON output.')
  }

  const isSelected = (id) => selected.indexOf(id) !== -1
  const selectedCount = selected.length
  const rowsPerPage = 20
  const showPagination = data.length > rowsPerPage
  const paginatedData = showPagination ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data
  const maxHeight = data.length > rowsPerPage ? 580 : 'auto'

  // Resizable Header Cell Component
  const ResizableHeaderCell = ({ column, children, ...props }) => {
    const width = columnWidths[column.id] || column.defaultWidth

    const handleMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()
      const startX = e.pageX
      const startWidth = width

      const handleMouseMove = (e) => {
        const newWidth = startWidth + (e.pageX - startX)
        const minWidth = column.minWidth || 50
        if (newWidth >= minWidth) {
          setColumnWidths((prev) => ({
            ...prev,
            [column.id]: newWidth,
          }))
        }
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return (
      <TableCell
        {...props}
        sx={{
          ...props.sx,
          width: width,
          minWidth: width,
          maxWidth: width,
          position: 'relative',
          whiteSpace: 'nowrap',
          overflow: 'visible',
          paddingRight: '12px !important',
        }}
      >
        {children}
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            position: 'absolute',
            right: -2,
            top: 0,
            bottom: 0,
            width: '8px',
            cursor: 'col-resize',
            zIndex: 1,
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.2)',
              '&::after': {
                content: '""',
                position: 'absolute',
                left: '50%',
                top: '20%',
                bottom: '20%',
                width: '2px',
                backgroundColor: 'rgba(25, 118, 210, 0.6)',
                transform: 'translateX(-50%)',
                borderRadius: '1px',
              },
            },
            '&:active': {
              backgroundColor: 'rgba(25, 118, 210, 0.3)',
            },
          }}
        />
      </TableCell>
    )
  }

  return (
    <Box sx={{ p: 3, maxWidth: '100%', mx: 'auto', position: 'relative' }}>
      <Paper
        elevation={2}
        sx={{
          mb: 3,
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1">
            Service Level Extractions
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {
              const header = columns.map((c) => c.label)
              const rows = data.map((row) => columns.map((c) => row[c.id] ?? ''))
              const sheet = XLSX.utils.aoa_to_sheet([header, ...rows])
              const wb = XLSX.utils.book_new()
              XLSX.utils.book_append_sheet(wb, sheet, 'SL Extractions')
              XLSX.writeFile(wb, 'sl-extractions.xlsx')
            }}
            sx={{
              borderColor: '#d1d5db',
              color: '#374151',
              '&:hover': { borderColor: '#9ca3af', backgroundColor: '#f8fafc' },
            }}
          >
            Export
          </Button>
        </Box>

        {selectedCount > 0 && (
          <Box sx={{ px: 2.5, pb: 1, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
            >
              Delete Selected ({selectedCount})
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => handleRetriggerExtraction('rows', selected)}
            >
              Retrigger Extraction ({selectedCount})
            </Button>
          </Box>
        )}

        <TableContainer
          sx={{
            maxHeight,
            overflow: 'auto',
            position: 'relative',
            borderTop: '1px solid #e5e7eb',
            pr: 0,
          }}
        >
          <Table
            stickyHeader
            sx={{
              tableLayout: 'auto',
              width: '100%',
              minWidth: 'max-content',
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{ backgroundColor: '#f7f7f7', width: 50, position: 'sticky', left: 0, zIndex: 3 }}
                >
                  <Checkbox
                    indeterminate={selectedCount > 0 && selectedCount < data.length}
                    checked={data.length > 0 && selectedCount === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {columns.map((column) => (
                  <ResizableHeaderCell
                    key={column.id}
                    column={column}
                    sx={{
                      backgroundColor: '#f7f7f7',
                      fontWeight: 700,
                      minWidth: columnWidths[column.id],
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        pr: 3,
                        width: '100%',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          flex: '0 0 auto',
                          fontWeight: 700,
                          color: '#6b7280',
                        }}
                      >
                        {column.label}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          flexShrink: 0,
                          ml: 'auto',
                          mr: 0.5,
                        }}
                      >
                        {taxonomyFields.includes(column.id) && (
                          <Tooltip title="Filter options">
                            <IconButton
                              ref={(el) => {
                                if (el) filterButtonRefs.current[column.id] = el
                              }}
                              id={`filter-btn-${column.id}`}
                              size="small"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleFilterClick(e, column.id)
                              }}
                              sx={{
                                p: 0.5,
                                flexShrink: 0,
                                color: '#9ca3af',
                                '&:hover': { color: '#4b5563' },
                              }}
                            >
                              <FilterListIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Retrigger extraction for this column">
                          <IconButton
                            size="small"
                            onClick={() => handleRetriggerExtraction('column', column.id)}
                            sx={{
                              p: 0.5,
                              flexShrink: 0,
                              color: '#9ca3af',
                              '&:hover': { color: '#4b5563' },
                            }}
                          >
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </ResizableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => {
                const isRowSelected = isSelected(row.id)
                return (
                  <TableRow
                    key={row.id}
                    selected={isRowSelected}
                    hover
                    sx={{
                      '&:hover': { backgroundColor: '#f9fafb' },
                      '&.Mui-selected': { backgroundColor: '#eef2ff !important' },
                    }}
                  >
                    <TableCell padding="checkbox" sx={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 2 }}>
                      <Checkbox
                        checked={isRowSelected}
                        onChange={() => handleSelectRow(row.id)}
                      />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          width: columnWidths[column.id] || column.defaultWidth,
                          minWidth: columnWidths[column.id] || column.defaultWidth,
                          maxWidth: 'unset',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: '#1f2933',
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {row[column.id] || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {showPagination && (
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={(_e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        )}
      </Paper>

      {/* Filter Menus - Using custom component with manual positioning */}
      {columns
        .filter((column) => taxonomyFields.includes(column.id))
        .map((column) => (
          <FilterMenu
            key={`filter-menu-${column.id}`}
            anchorEl={filterMenus[column.id]}
            open={Boolean(filterMenus[column.id])}
            onClose={() => handleFilterClose(column.id)}
            columnId={column.id}
            column={column}
            data={data}
          />
        ))}

      {/* AI Insights and References Section */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'stretch' }}>
        <Paper elevation={2} sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', borderRadius: 8 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            AI Insights
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, flex: 1 }}>
            {aiInsights.map((insight, index) => (
              <Typography
                key={index}
                component="li"
                variant="body2"
                sx={{ mb: 1, color: 'text.secondary' }}
              >
                {insight}
              </Typography>
            ))}
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', borderRadius: 8 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            References
          </Typography>
          <Box sx={{ flex: 1 }}>
            {references.map((ref, index) => (
              <Chip
                key={index}
                label={ref}
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
                size="small"
              />
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          sx={{ minWidth: 150 }}
        >
          Submit
        </Button>
      </Box>

      {/* Retrigger Extraction Dialog */}
      <Dialog open={retriggerDialog.open} onClose={() => setRetriggerDialog({ open: false, type: null, target: null })} maxWidth="sm" fullWidth>
        <DialogTitle>
          Retrigger Extraction
          {retriggerDialog.type === 'column' && ` - ${columns.find((c) => c.id === retriggerDialog.target)?.label}`}
          {retriggerDialog.type === 'rows' && ` - ${retriggerDialog.target.length} Row(s)`}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Instructions for Agent"
            placeholder="Enter new instructions for what needs to be extracted..."
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRetriggerDialog({ open: false, type: null, target: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleRetriggerSubmit}
            variant="contained"
            disabled={!instructions.trim()}
          >
            Retrigger
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SLExtractionTable

