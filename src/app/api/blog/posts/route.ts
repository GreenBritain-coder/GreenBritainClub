import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

// Sample blog data for initial seeding only
const sampleBlogPosts = [
  {
    _id: '1',
    title: 'The Benefits of CBD for Anxiety and Stress Relief',
    slug: 'benefits-of-cbd-for-anxiety',
    excerpt: 'Discover how CBD can help manage anxiety and stress through its interaction with the endocannabinoid system.',
    content: 'CBD has shown promising results in reducing anxiety and stress levels. Studies suggest that CBD interacts with the endocannabinoid system, which plays a role in regulating stress responses. Many users report feeling calmer and more relaxed after using CBD products. While more research is needed, the current evidence is encouraging for those seeking natural alternatives for anxiety management.',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1503262028195-93c528f03218?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    createdAt: '2025-01-05T12:00:00Z'
  },
  {
    _id: '2',
    title: 'Understanding Different Cannabis Strains',
    slug: 'understanding-cannabis-strains',
    excerpt: 'Learn about the differences between indica, sativa, and hybrid cannabis strains and their various effects.',
    content: 'Cannabis strains are typically categorized as indica, sativa, or hybrid. Indica strains are known for their relaxing and sedating effects, often used for pain relief and sleep. Sativa strains tend to be more energizing and uplifting, potentially helping with depression and fatigue. Hybrids combine characteristics of both. The effects of each strain are influenced by their unique combination of cannabinoids and terpenes.',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1536152470836-b943b246224c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    createdAt: '2025-01-04T14:30:00Z'
  },
  {
    _id: '3',
    title: 'Cannabis Legalization in the UK: Progress, Challenges, and City-by-City Guide',
    slug: 'cannabis-legalization-uk',
    excerpt: 'A comprehensive overview of cannabis legalization across the UK, from London to Edinburgh, Manchester to Cardiff, examining regional differences, policy developments, and advocacy efforts.',
    content: `# Cannabis Legalization in the UK: A Comprehensive Overview

## Current Legal Status Across the UK

The legal status of cannabis in the United Kingdom has evolved significantly in recent years, though it remains complex and varies by region. As of 2024, cannabis is classified as a Class B controlled substance under the Misuse of Drugs Act 1971 throughout the UK. However, the approach to enforcement and medical access differs across England, Scotland, Wales, and Northern Ireland.

In 2018, the UK made a landmark change when medical cannabis was legalized, allowing specialist doctors to prescribe cannabis-based products for medicinal use (CBPMs) in limited circumstances. This change came after high-profile cases involving children with severe epilepsy, such as Alfie Dingley and Billy Caldwell, whose conditions responded positively to cannabis-based treatments.

Despite this progress, recreational use remains illegal throughout the UK, with penalties including up to 5 years imprisonment for possession and up to 14 years for supply and production.

## Regional Approaches to Cannabis Policy

### London and Southeast England

London has seen some of the most progressive approaches to cannabis enforcement in the UK. The Metropolitan Police has implemented informal decriminalization through diversion schemes in several boroughs. In 2019, the Mayor of London, Sadiq Khan, supported pilot programs to divert young people caught with small amounts of cannabis away from criminal justice and toward education and support services.

The Thames Valley region has also explored similar approaches, with police forces focusing resources on serious drug offenses rather than personal possession cases.

![Cannabis Policy Reform in London](https://images.unsplash.com/photo-1536152470836-b943b246224c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80)

### Manchester and Northern England

Greater Manchester has been at the forefront of drug policy reform in the north of England. In 2022, Manchester City Council supported a review of drug policies, including consideration of a "cannabis warning" system that would treat personal possession as a health rather than criminal issue.

Cities like Liverpool, Leeds, and Newcastle have seen growing cannabis social clubs operating in a legal gray area, advocating for policy reform while providing safe spaces for cannabis users to gather.

### Scotland's Distinct Approach

Scotland has taken steps toward treating drug use, including cannabis, as a public health issue rather than a criminal one. In 2021, the Lord Advocate announced that police could issue warnings for possession of Class A drugs, extending a policy already in place for cannabis and other substances.

Edinburgh and Glasgow have been particularly progressive, with local authorities supporting harm reduction approaches and police forces often de-prioritizing cannabis possession offenses.

### Wales and Cannabis Research

Wales has emerged as a center for cannabis research, particularly in Cardiff where universities are studying the potential medical applications of cannabinoids. The Welsh government has expressed interest in developing a medicinal cannabis industry, which could create jobs while advancing medical research.

## Medical Cannabis Access Across UK Cities

Access to medical cannabis varies significantly across UK cities:

- **London** has the highest concentration of private cannabis clinics, making access somewhat easier for residents.
- **Manchester, Birmingham, and Edinburgh** have established medical cannabis clinics but with more limited availability.
- **Bristol** has become a hub for cannabis research with university partnerships studying cannabinoid therapies.
- **Cardiff** hosts several research initiatives focused on cannabis-based medicines.

![Medical Cannabis Research](https://images.unsplash.com/photo-1503262028195-93c528f03218?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80)

Despite the 2018 legalization of medical cannabis, NHS prescriptions remain extremely rare. Most patients access treatment through private clinics, creating a two-tier system where only those who can afford private healthcare can reliably access medical cannabis.

## Public Opinion and Regional Variations

Public support for cannabis reform varies by region:

- **London and Southeast England**: Polls consistently show 65-70% support for medical cannabis and around 50% support for recreational legalization.
- **Scotland**: Support for medical cannabis exceeds 70%, with recreational legalization support at approximately 55%.
- **Northern England**: Cities like Manchester and Liverpool show strong support (60%+) for both medical and recreational cannabis.
- **Wales**: Support for medical cannabis is high (65-70%), while recreational legalization support is more moderate (45-50%).
- **Northern Ireland**: More conservative attitudes prevail, with lower support for recreational legalization (35-40%), though medical cannabis support remains relatively high (60%).

## Economic Potential by Region

The potential economic benefits of a regulated cannabis industry vary across UK regions:

- **London and the Southeast** could generate an estimated £1.2 billion annually through taxes and tourism.
- **Manchester and Northern England** could see up to £800 million in economic activity and thousands of new jobs.
- **Scotland** has ideal growing conditions for certain strains and could develop a cannabis industry worth up to £500 million annually.
- **Wales** has potential for a research-focused cannabis industry, particularly around Cardiff and Swansea.
- **Northern Ireland** could benefit from cross-border opportunities if the Republic of Ireland moves toward legalization.

## Advocacy and Reform Movements

Cannabis advocacy groups are active across the UK, with particularly strong presences in:

- **London**: Organizations like CLEAR and the United Patients Alliance regularly hold events and lobby Parliament.
- **Manchester**: The city hosts several cannabis social clubs and reform advocacy groups.
- **Brighton**: Has a long history of cannabis activism and hosts the annual "Green Pride" event.
- **Glasgow and Edinburgh**: Scottish cannabis advocacy groups are pushing for devolved control over drug policy.
- **Cardiff**: Welsh advocacy focuses on medical access and research opportunities.

![Cannabis Advocacy in the UK](https://images.unsplash.com/photo-1498671546682-94a232c26d17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80)

## Challenges to Reform

Despite growing support, cannabis reform faces significant challenges:

1. **Political resistance**: Conservative governments have historically opposed legalization, though this stance is softening regarding medical use.
2. **Regional governance**: Devolved administrations in Scotland, Wales, and Northern Ireland have limited powers over drug policy.
3. **International treaties**: The UK is signatory to international drug control treaties that restrict legalization options.
4. **Public misconceptions**: Despite growing acceptance, misconceptions about cannabis persist, particularly regarding mental health risks.

## Future Outlook for UK Cities

The future of cannabis policy in the UK is likely to develop unevenly across different cities and regions:

- **London** may continue to lead with de facto decriminalization and expanded medical access.
- **Manchester, Liverpool, and Bristol** are likely to follow with progressive local policies.
- **Edinburgh and Glasgow** may push for Scotland-specific reforms under devolved powers.
- **Cardiff and Swansea** could focus on developing research and medical cannabis industries.
- **Belfast** may see changes if cross-border issues with the Republic of Ireland drive policy reconsideration.

## Conclusion

While full legalization of recreational cannabis remains unlikely in the immediate future, the UK is experiencing a gradual shift toward more progressive policies. This shift is occurring at different rates across UK cities and regions, with metropolitan areas generally leading the way.

Medical cannabis access is likely to improve first, with recreational reform following a more extended timeline. The experiences of cities like London, Manchester, Edinburgh, and Cardiff will be crucial in shaping the national conversation on cannabis policy in the coming years.

For residents across the UK interested in cannabis policy reform, staying informed about local initiatives and connecting with regional advocacy groups offers the best opportunity to support and influence the evolving landscape of cannabis legalization.`,
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1536152470836-b943b246224c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1536152470836-b943b246224c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503262028195-93c528f03218?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498671546682-94a232c26d17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    keywords: [
      'cannabis legalization UK', 'medical cannabis London', 'cannabis laws Manchester', 
      'Edinburgh cannabis policy', 'Cardiff cannabis research', 'UK drug reform', 
      'cannabis advocacy Birmingham', 'Glasgow cannabis laws', 'Bristol medical cannabis',
      'Liverpool cannabis club', 'Leeds cannabis policy', 'Newcastle cannabis laws',
      'Belfast cannabis regulation', 'UK medical marijuana', 'cannabis prescription UK cities'
    ],
    cities: [
      'London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Cardiff', 
      'Bristol', 'Liverpool', 'Leeds', 'Sheffield', 'Newcastle', 'Belfast', 
      'Nottingham', 'Oxford', 'Cambridge', 'Southampton', 'Brighton'
    ],
    createdAt: '2025-01-03T09:15:00Z',
    updatedAt: '2024-07-15T14:30:00Z'
  },
  {
    _id: '4',
    title: 'Growing Cannabis at Home: Tips for Beginners',
    slug: 'growing-cannabis-beginners',
    excerpt: 'Essential tips and guidance for those interested in growing cannabis at home where legally permitted.',
    content: 'For beginners growing cannabis at home (where legal), start with the basics: choose the right strain for your experience level, invest in quality seeds, and understand the growing environment requirements. Cannabis plants need proper lighting, ventilation, nutrients, and careful watering. Common mistakes include overwatering, poor lighting, and incorrect pH levels. Remember that patience is key—rushing the process rarely leads to good results.',
    status: 'draft',
    featuredImage: 'https://images.unsplash.com/photo-1485149476586-20f33627b8c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    createdAt: '2025-01-02T16:45:00Z'
  },
  {
    _id: '5',
    title: 'The Endocannabinoid System Explained',
    slug: 'endocannabinoid-system-explained',
    excerpt: 'A detailed look at how the endocannabinoid system works and its role in maintaining bodily homeostasis.',
    content: 'The endocannabinoid system (ECS) is a complex cell-signaling system identified in the early 1990s. It plays a role in regulating a range of functions and processes including sleep, mood, appetite, memory, reproduction, and pain. The ECS involves three core components: endocannabinoids, receptors, and enzymes. Phytocannabinoids from the cannabis plant, such as THC and CBD, can interact with this system, which explains many of their effects on the human body.',
    status: 'draft',
    featuredImage: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    createdAt: '2025-01-01T11:20:00Z'
  },
  {
    _id: '6',
    title: 'Medical Cannabis: Patient Stories and Success Cases',
    slug: 'medical-cannabis-success-stories',
    excerpt: 'Real-life testimonials from patients who have found relief through medical cannabis treatments.',
    content: 'Medical cannabis has transformed the lives of many patients suffering from chronic conditions. From epilepsy to multiple sclerosis, cancer to chronic pain, the therapeutic potential of cannabis continues to show promise. This article shares the stories of several patients who have experienced significant improvements in their quality of life after incorporating medical cannabis into their treatment regimens, often after conventional medicines failed to provide adequate relief.',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-12-31T10:30:00Z'
  },
  {
    _id: '7',
    title: 'Cannabis Terpenes: The Aromatic Compounds That Shape Your Experience',
    slug: 'cannabis-terpenes-guide',
    excerpt: 'Understanding the role of terpenes in cannabis and how they contribute to the entourage effect.',
    content: 'Terpenes are aromatic compounds found in many plants, including cannabis. They\'re responsible for the distinctive smells and flavors of different cannabis strains, but their role goes far beyond aroma. Research suggests terpenes work synergistically with cannabinoids like THC and CBD to enhance therapeutic effects—a phenomenon known as the entourage effect. Common cannabis terpenes include myrcene (earthy), limonene (citrusy), pinene (pine), and linalool (lavender), each contributing unique properties to the overall experience.',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1556928045-16f7f50be0f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    createdAt: '2024-12-30T15:45:00Z'
  }
];

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Check if blog collection is empty and seed with sample data
    const count = await db.collection('blogPosts').countDocuments();
    if (count === 0) {
      console.log('Seeding blog posts with sample data...');
      await db.collection('blogPosts').insertMany(sampleBlogPosts);
    }
    
    // Fetch all blog posts, sorted by creation date (newest first)
    const posts = await db.collection('blogPosts').find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const post = await request.json();
    const { db } = await connectToDatabase();
    
    // Create new post with timestamp
    const newPost = {
      ...post,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Insert into MongoDB
    const result = await db.collection('blogPosts').insertOne(newPost);
    
    // Return the created post with the MongoDB _id
    const createdPost = {
      ...newPost,
      _id: result.insertedId.toString()
    };
    
    return NextResponse.json(createdPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const post = await request.json();
    const { db } = await connectToDatabase();
    
    if (!post._id) {
      return NextResponse.json(
        { error: 'Post ID is required for update' },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData = {
      ...post,
      updatedAt: new Date().toISOString()
    };
    
    // Remove _id from update data as MongoDB doesn't allow updating _id
    delete updateData._id;
    
    // Update the post in MongoDB
    let result;
    try {
      if (ObjectId.isValid(post._id)) {
        result = await db.collection('blogPosts').updateOne(
          { _id: new ObjectId(post._id) },
          { $set: updateData }
        );
      } else {
        throw new Error('Not a valid ObjectId');
      }
    } catch (objectIdError) {
      // If ObjectId fails, try with string ID (for legacy posts)
      result = await db.collection('blogPosts').updateOne(
        { _id: post._id },
        { $set: updateData }
      );
    }
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Return the updated post
    return NextResponse.json({ ...post, updatedAt: updateData.updatedAt });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { db } = await connectToDatabase();
    
    console.log('DELETE request received for post ID:', id);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    let result;
    
    // Try to delete with ObjectId first (for MongoDB-generated IDs)
    try {
      if (ObjectId.isValid(id)) {
        console.log('Attempting delete with ObjectId format');
        result = await db.collection('blogPosts').deleteOne(
          { _id: new ObjectId(id) }
        );
      } else {
        throw new Error('Not a valid ObjectId');
      }
    } catch (objectIdError) {
      // If ObjectId fails, try with string ID (for legacy posts)
      console.log('ObjectId failed, trying string ID format');
      result = await db.collection('blogPosts').deleteOne(
        { _id: id }
      );
    }
    
    console.log('Delete result:', result);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('Delete error details:', {
      message: errorMessage,
      stack: errorStack
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to delete post',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Contact support'
      },
      { status: 500 }
    );
  }
}
