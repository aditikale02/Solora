# SOLORA ADMIN PANEL - USER GUIDE

## 🔐 Accessing the Admin Panel

**URL:** `/admin/login`

**Login Credentials:**
- Use your Supabase authenticated email
- Must be listed in `VITE_ADMIN_EMAILS` environment variable

---

## 📊 Dashboard Overview

The admin dashboard has 7 main sections:

1. **Dashboard** - Overview statistics
2. **Packages** - Manage trip packages
3. **Destinations** - Manage destinations
4. **Categories** - Manage destination categories
5. **Inquiries** - View customer inquiries
6. **Users** - User management (coming soon)
7. **Uploads** - Bulk image uploads

---

## 🎯 QUICK START WORKFLOW

### Step 1: Create Categories
1. Go to **Categories** panel
2. Click the form on the left
3. Fill in:
   - Title (e.g., "Mountains & Treks")
   - Description
   - Upload category image
   - Set sort order (higher = appears first)
4. Click **Create category**

### Step 2: Create Destinations
1. Go to **Destinations** panel
2. Fill in the form:
   - **Category**: Use the searchable dropdown (NEW!)
   - **Name**: Destination name
   - **State & City**: Location details
   - **Short Description**: Brief overview
   - **Long Description**: Detailed information
   - **Tags**: Comma-separated (e.g., "mountains, snow, treks")
   - **Hero Image**: Upload or provide URL
   - **Best Season**: When to visit
   - **Budget**: Estimated cost
   - **Ideal Duration**: Number of days
   - **Travel Tips**: Helpful advice
   - **Featured**: Check to feature on homepage
   - **Active**: Check to make visible
3. Click **Create destination**

### Step 3: Create Packages
1. Go to **Packages** panel
2. Fill in the form:
   - **Destination**: Use searchable dropdown (NEW!)
     - Type to search existing destinations
     - Or click "+ Create New Destination" to add one instantly
   - **Title**: Package name
   - **Description**: What's included
   - **Features**: Comma-separated list
   - **Duration**: Number of days
   - **Price**: Amount in INR (or other currency)
   - **Hero Image**: Upload package image
   - **Active**: Check to make visible
3. Click **Save package**

---

## 🆕 NEW FEATURES

### Searchable Dropdowns (Combobox)

**What's New:**
- All dropdowns are now searchable
- Type to filter options instantly
- Keyboard navigation support
- Create new items on-the-fly

**How to Use:**

#### Destination Selector (in Packages):
1. Click the dropdown
2. Start typing destination name
3. Select from filtered results
4. OR click "+ Create New Destination" to add one

#### Category Selector (in Destinations):
1. Click the dropdown
2. Type to search categories
3. Select from results
4. Leave empty for "No category"

**Keyboard Shortcuts:**
- `↑` `↓` - Navigate options
- `Enter` - Select option
- `Esc` - Close dropdown
- Type to search

---

## 📸 Image Upload System

### Upload Methods:

#### Method 1: Inline Upload (Recommended)
When creating/editing content:
1. Find the "Hero image" field
2. **Drag & drop** an image onto the upload area
3. OR click **Choose file** to browse
4. Preview appears automatically
5. Click **Upload image**
6. Image URL is saved automatically

#### Method 2: Bulk Upload Panel
For uploading multiple images:
1. Go to **Uploads** panel
2. Select package or destination from dropdown
3. Upload images one by one
4. Each upload is saved immediately

### Image Requirements:
- **Formats:** JPG, PNG, WebP
- **Max Size:** 5MB per image
- **Recommended:** 1600x900px or larger
- **Aspect Ratio:** 16:9 for hero images

### Image Types:
- **Hero Images**: Main banner for packages/destinations
- **Gallery Images**: Additional photos (via Uploads panel)
- **Category Images**: Category thumbnails

---

## 🎨 Content Best Practices

### Writing Descriptions:

**Short Description (Destinations):**
- 1-2 sentences
- Highlight key features
- Use evocative language
- Example: "Snowy peaks, cafes, and easy access to adventure."

**Long Description:**
- 2-3 paragraphs
- Detailed information
- What makes it special
- Who it's for
- Example: "A classic mountain base for travelers who want a little of everything..."

**Package Description:**
- What's included
- Experience highlights
- Target audience
- Example: "A scenic mountain stay with easy treks, cafes, and one strong snowy highlight."

### Tags:
- Use lowercase
- Comma-separated
- 3-5 tags per item
- Examples: "mountains, snow, treks" or "beaches, nightlife, seafood"

### Features (Packages):
- Comma-separated list
- Be specific
- Include accommodations, meals, transfers
- Example: "Stay in Old Manali, Solang Valley access, breakfast, local transfers"

---

## 🔄 Editing Content

### Edit Existing Items:
1. Find the item in the list (right side)
2. Click **Edit** button
3. Form populates with current data
4. Make changes
5. Click **Update** or **Save**
6. Click **Cancel** to discard changes

### Quick Actions:
- **Activate/Deactivate**: Toggle visibility without editing
- **Feature/Unfeature**: Toggle featured status (destinations)
- **Delete**: Permanently remove (use with caution!)

---

## 📋 Managing Inquiries

### View Customer Inquiries:
1. Go to **Inquiries** panel
2. See all contact form submissions
3. Information shown:
   - Full name
   - Email & phone
   - Selected service
   - Budget range
   - Submission date

### Follow-up:
- Copy email/phone to contact customer
- No built-in messaging (use external email)

---

## 🎯 Dashboard Statistics

The main dashboard shows:
- **Total Packages**: Number of trip packages
- **Total Destinations**: Number of destinations
- **Total Categories**: Number of categories
- **Total Inquiries**: Number of customer inquiries

Click any panel name in the sidebar to navigate.

---

## 🚨 Common Issues & Solutions

### Issue: Dropdown shows no options
**Solution:** Create items first (categories before destinations, destinations before packages)

### Issue: Can't find destination in dropdown
**Solution:** Use the search feature - type the destination name

### Issue: Image upload fails
**Solution:** 
- Check file size (max 5MB)
- Ensure format is JPG, PNG, or WebP
- Check internet connection

### Issue: Changes not saving
**Solution:**
- Check for error messages
- Ensure all required fields are filled
- Refresh page and try again

### Issue: Can't create package without destination
**Solution:** Use the "+ Create New Destination" option in the dropdown

---

## 💡 Pro Tips

1. **Create in Order**: Categories → Destinations → Packages
2. **Use Search**: Type in dropdowns instead of scrolling
3. **Preview Images**: Always preview before uploading
4. **Save Often**: Changes save immediately on submit
5. **Featured Content**: Mark 3-5 destinations as featured for homepage
6. **Active Status**: Use to hide content without deleting
7. **Tags Matter**: Good tags improve search and filtering
8. **Budget Format**: Use "₹18k - ₹38k" format for consistency

---

## 🎨 Design Guidelines

### Color Palette:
- **Gold**: #C9A96E (primary accent)
- **Charcoal**: #1A1714 (text)
- **Cream**: #F7F0E6 (light backgrounds)
- **Beige**: #F7F2EC (subtle backgrounds)

### Typography:
- **Headings**: Cormorant Garamond (serif)
- **Body**: DM Sans (sans-serif)

### Image Style:
- Natural lighting
- Warm tones
- Travel/adventure focused
- High quality, professional

---

## 🔒 Security Notes

- Only authorized emails can access admin panel
- Always log out when done
- Don't share admin credentials
- Review changes before publishing
- Test on staging before production (if available)

---

## 📞 Need Help?

If you encounter issues:
1. Check this guide first
2. Review error messages carefully
3. Check browser console for technical errors
4. Contact technical support if needed

---

## 🎉 You're Ready!

The admin panel is intuitive and powerful. Start by creating a few test items to get familiar with the workflow.

**Remember:** The searchable dropdowns make everything faster - use them!

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd")  
**Version:** 2.0 (with Combobox improvements)
