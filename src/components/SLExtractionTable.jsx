import React, { useState, useRef } from 'react'
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
} from '@mui/material'
import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

// Sample data structure - this would come from the agent
const initialData = [
  {
    id: 1,
    sNo: 1,
    title: 'Severity Level 1 Incident Response',
    lineOfBusiness: '-',
    programProject: 'Skype Managed Services',
    serviceLevelId: 'SL0001',
    documentName: 'EXHIBIT B',
    serviceLevelDescription: 'Vendor will respond to Severity Level 1 incidents within 1 hour',
    slType: 'SL',
    si: 'In',
  },
  {
    id: 2,
    sNo: 2,
    title: 'Severity Level 2 Incident Response',
    lineOfBusiness: '-',
    programProject: 'Skype Managed Services',
    serviceLevelId: 'SL0002',
    documentName: 'EXHIBIT B',
    serviceLevelDescription: 'Vendor will respond to Severity Level 2 incidents within 4 hours',
    slType: 'SL',
    si: 'In',
  },
  {
    id: 3,
    sNo: 3,
    title: 'Severity Level 1 Priority Resolution',
    lineOfBusiness: '-',
    programProject: 'Skype Managed Services',
    serviceLevelId: 'SL0003',
    documentName: 'EXHIBIT B',
    serviceLevelDescription: 'Vendor will resolve Severity Level 1 incidents within 24 hours',
    slType: 'SL',
    si: 'In',
  },
  {
    id: 4,
    sNo: 4,
    title: 'Severity Level 2 Priority Resolution',
    lineOfBusiness: '-',
    programProject: 'Skype Managed Services',
    serviceLevelId: 'SL0004',
    documentName: 'EXHIBIT B',
    serviceLevelDescription: 'Vendor will resolve Severity Level 2 incidents within 48 hours',
    slType: 'SL',
    si: 'In',
  },
  {
    id: 5,
    sNo: 5,
    title: 'Severity Level 1 Priority Resolution',
    lineOfBusiness: '-',
    programProject: 'Skype Managed Services',
    serviceLevelId: 'SL0005',
    documentName: 'EXHIBIT B',
    serviceLevelDescription: 'Vendor will resolve Severity Level 1 incidents within 24 hours',
    slType: 'SL',
    si: 'In',
  },
  {
    id: 6,
    sNo: 6,
    title: 'Severity Level 2 Priority Resolution',
    lineOfBusiness: '-',
    programProject: 'Skype Managed Services',
    serviceLevelId: 'SL0006',
    documentName: 'EXHIBIT B',
    serviceLevelDescription: 'Vendor will resolve Severity Level 2 incidents within 48 hours',
    slType: 'SL',
    si: 'In',
  },
  {
    id: 7,
    sNo: 7,
    title: 'Severity Level 1 Priority Resolution',
    lineOfBusiness: '-',
    programProject: 'Skype Managed Services',
    serviceLevelId: 'SL0007',
    documentName: 'EXHIBIT B',
    serviceLevelDescription: 'Vendor will resolve Severity Level 1 incidents within 24 hours',
    slType: 'SL',
    si: 'In',
  },
  {
    id: 8,
    sNo: 8,
    title: 'Severity Level 2 Priority Resolution',
    lineOfBusiness: '-',
    programProject: 'Skype Managed Services',
    serviceLevelId: 'SL0008',
    documentName: 'EXHIBIT B',
    serviceLevelDescription: 'Vendor will resolve Severity Level 2 incidents within 48 hours',
    slType: 'SL',
    si: 'In',
  },
]

// Fields that have taxonomies (should show filter button)
const taxonomyFields = ['lineOfBusiness', 'programProject', 'slType', 'si']

const columns = [
  { id: 'sNo', label: 'S. No.', minWidth: 80, defaultWidth: 80 },
  { id: 'title', label: 'Title/SL Name', minWidth: 200, defaultWidth: 200 },
  { id: 'lineOfBusiness', label: 'Line of Business', minWidth: 150, defaultWidth: 150 },
  { id: 'programProject', label: 'Program/Project', minWidth: 180, defaultWidth: 180 },
  { id: 'serviceLevelId', label: 'Service Level ID', minWidth: 150, defaultWidth: 150 },
  { id: 'documentName', label: 'Document Name/ID', minWidth: 150, defaultWidth: 150 },
  { id: 'serviceLevelDescription', label: 'Service Level Description', minWidth: 300, defaultWidth: 300 },
  { id: 'slType', label: 'SL Type', minWidth: 100, defaultWidth: 100 },
  { id: 'si', label: 'SI', minWidth: 80, defaultWidth: 80 },
]

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
  const [columnWidths, setColumnWidths] = useState(
    columns.reduce((acc, col) => {
      acc[col.id] = col.defaultWidth
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

  // Truncate cell text to a few words, show tooltip when truncated
  const TruncatedCellContent = ({ value }) => {
    const rawValue = value ?? '-'
    const words = typeof rawValue === 'string' ? rawValue.trim().split(/\s+/).filter(Boolean) : []
    const wordLimit = 7
    const truncated = words.length > wordLimit
    const displayValue =
      rawValue === '-' || rawValue === '' || typeof rawValue !== 'string'
        ? rawValue
        : truncated
          ? `${words.slice(0, wordLimit).join(' ')}…`
          : rawValue

    return (
      <Tooltip title={rawValue} disableHoverListener={!truncated} disableFocusListener={!truncated} disableTouchListener={!truncated}>
        <Typography
          component="span"
          sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {displayValue}
        </Typography>
      </Tooltip>
    )
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
      {/* Service Level Extractions Section */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Service Level Extractions
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {
              const json = JSON.stringify(data, null, 2)
              const blob = new Blob([json], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'sl-extractions.json'
              a.click()
            }}
          >
            Export
          </Button>
        </Box>

        {/* Multi-select action buttons */}
        {selectedCount > 0 && (
          <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 1 }}>
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
            maxHeight: 600,
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ backgroundColor: '#f5f5f5', width: 50 }}>
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
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        pr: 2.5,
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
                          fontWeight: 600,
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
                              sx={{ p: 0.5, flexShrink: 0 }}
                            >
                              <FilterListIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Retrigger extraction for this column">
                          <IconButton
                            size="small"
                            onClick={() => handleRetriggerExtraction('column', column.id)}
                            sx={{ p: 0.5, flexShrink: 0 }}
                          >
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </ResizableHeaderCell>
                ))}
                <TableCell sx={{ backgroundColor: '#f5f5f5', width: 80 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => {
                const isRowSelected = isSelected(row.id)
                return (
                  <TableRow
                    key={row.id}
                    selected={isRowSelected}
                    hover
                    sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell padding="checkbox">
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
                          maxWidth: columnWidths[column.id] || column.defaultWidth,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <TruncatedCellContent value={row[column.id]} />
                      </TableCell>
                    ))}
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteRow(row.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
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
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Paper elevation={2} sx={{ flex: 1, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircleIcon sx={{ color: 'green', mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              AI Insights
            </Typography>
          </Box>
          <Box component="ul" sx={{ pl: 3, m: 0 }}>
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

        <Paper elevation={2} sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            References
          </Typography>
          <Box>
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

