import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Upload, Download, Trash2, Plus, Eye } from 'lucide-react'
import { generatePDF } from './utils/pdfGenerator.js'
import './App.css'

function App() {
  const [logo, setLogo] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [currency, setCurrency] = useState('USD')
  const [billData, setBillData] = useState({
    // Company Info
    companyName: '',
    companyPhone: '',
    companyAddress: '',
    
    // Bill To
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    
    // Invoice Info
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    
    // Items
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }]
  })

  const fileInputRef = useRef(null)

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and professional design' },
    { id: 'classic', name: 'Classic', description: 'Traditional business invoice' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant layout' },
    { id: 'colorful', name: 'Colorful', description: 'Vibrant and eye-catching' }
  ]

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ]

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogo(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field, value) => {
    setBillData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...billData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Calculate amount for quantity and rate changes
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    }
    
    setBillData(prev => ({
      ...prev,
      items: newItems
    }))
  }

  const addItem = () => {
    setBillData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }))
  }

  const removeItem = (index) => {
    setBillData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const calculateTotal = () => {
    return billData.items.reduce((total, item) => total + item.amount, 0)
  }

  const handleDownloadPDF = async () => {
    const success = await generatePDF('invoice-preview', `invoice-${billData.invoiceNumber || 'draft'}.pdf`)
    if (!success) {
      alert('Error generating PDF. Please try again.')
    }
  }

  const getCurrentCurrency = () => {
    return currencies.find(c => c.code === currency)
  }

  const clearForm = () => {
    setBillData({
      companyName: '',
      companyPhone: '',
      companyAddress: '',
      clientName: '',
      clientPhone: '',
      clientAddress: '',
      invoiceNumber: '',
      invoiceDate: '',
      dueDate: '',
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }]
    })
    setLogo(null)
  }

  const fillSampleData = () => {
    setBillData({
      companyName: 'Acme Corporation',
      companyPhone: '+1 (555) 123-4567',
      companyAddress: '123 Business St, Suite 100\nNew York, NY 10001',
      clientName: 'John Doe',
      clientPhone: '+1 (555) 987-6543',
      clientAddress: '456 Client Ave\nLos Angeles, CA 90210',
      invoiceNumber: 'INV-001',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        { description: 'Web Development Services', quantity: 40, rate: 75, amount: 3000 },
        { description: 'UI/UX Design', quantity: 20, rate: 85, amount: 1700 }
      ]
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bill Generator</h1>
          <p className="text-gray-600">Create professional invoices with custom logos and templates</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <Button onClick={clearForm} variant="outline" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Clear Form
          </Button>
          <Button onClick={fillSampleData} variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Fill Sample Data
          </Button>
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Logo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Company Logo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {logo && (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <img src={logo} alt="Company Logo" className="h-12 w-auto" />
                      <Button 
                        onClick={() => setLogo(null)} 
                        variant="ghost" 
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Template Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTemplate === template.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Currency Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Currency</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name} ({curr.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Form Tabs */}
            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="invoice">Invoice</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
              </TabsList>

              <TabsContent value="company" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={billData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyPhone">Phone</Label>
                      <Input
                        id="companyPhone"
                        value={billData.companyPhone}
                        onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyAddress">Address</Label>
                      <Textarea
                        id="companyAddress"
                        value={billData.companyAddress}
                        onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                        placeholder="Enter company address"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="client" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Bill To</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        value={billData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Phone</Label>
                      <Input
                        id="clientPhone"
                        value={billData.clientPhone}
                        onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                        placeholder="Enter client phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientAddress">Address</Label>
                      <Textarea
                        id="clientAddress"
                        value={billData.clientAddress}
                        onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                        placeholder="Enter client address"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invoice" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="invoiceNumber">Invoice Number</Label>
                      <Input
                        id="invoiceNumber"
                        value={billData.invoiceNumber}
                        onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                        placeholder="Enter invoice number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invoiceDate">Invoice Date</Label>
                      <Input
                        id="invoiceDate"
                        type="date"
                        value={billData.invoiceDate}
                        onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={billData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Items & Services
                      <Button onClick={addItem} size="sm" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Item
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {billData.items.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">Item {index + 1}</Badge>
                          {billData.items.length > 1 && (
                            <Button 
                              onClick={() => removeItem(index)} 
                              variant="ghost" 
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="Enter item description"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <Label>Rate ({getCurrentCurrency()?.symbol})</Label>
                            <Input
                              type="number"
                              value={item.rate}
                              onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <Label>Amount</Label>
                            <Input
                              value={`${getCurrentCurrency()?.symbol}${item.amount.toFixed(2)}`}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span>{getCurrentCurrency()?.symbol}{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Preview</CardTitle>
                <p className="text-sm text-gray-600">Template: {templates.find(t => t.id === selectedTemplate)?.name}</p>
              </CardHeader>
              <CardContent>
                <div id="invoice-preview" className="bg-white p-8 border rounded-lg shadow-sm min-h-[600px]">
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      {logo && (
                        <img src={logo} alt="Company Logo" className="h-16 w-auto mb-4" />
                      )}
                      <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Invoice #</div>
                      <div className="font-semibold">{billData.invoiceNumber || 'INV-000'}</div>
                      <div className="text-sm text-gray-600 mt-2">Date</div>
                      <div className="font-semibold">{billData.invoiceDate || 'Not set'}</div>
                      <div className="text-sm text-gray-600 mt-2">Due Date</div>
                      <div className="font-semibold">{billData.dueDate || 'Not set'}</div>
                    </div>
                  </div>

                  {/* Company and Client Info */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{billData.companyName || 'Your Company'}</div>
                        <div>{billData.companyPhone}</div>
                        <div className="whitespace-pre-line">{billData.companyAddress}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{billData.clientName || 'Client Name'}</div>
                        <div>{billData.clientPhone}</div>
                        <div className="whitespace-pre-line">{billData.clientAddress}</div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mb-8">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-2 font-semibold">Description</th>
                          <th className="text-right py-2 font-semibold">Qty</th>
                          <th className="text-right py-2 font-semibold">Rate</th>
                          <th className="text-right py-2 font-semibold">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billData.items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3">{item.description || 'Item description'}</td>
                            <td className="text-right py-3">{item.quantity}</td>
                            <td className="text-right py-3">{getCurrentCurrency()?.symbol}{item.rate.toFixed(2)}</td>
                            <td className="text-right py-3">{getCurrentCurrency()?.symbol}{item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Total */}
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between py-2 border-t-2 border-gray-200">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-lg">{getCurrentCurrency()?.symbol}{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

