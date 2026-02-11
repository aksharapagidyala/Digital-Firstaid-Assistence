import 'package:flutter/material.dart';
import 'burns_page.dart';
import 'cuts_page.dart';
import 'fractures_page.dart';
import 'cpr_page.dart';


void main() {
  runApp(const FirstAidApp());
}

class FirstAidApp extends StatelessWidget {
  const FirstAidApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Digital First Aid',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Digital First Aid Assistance'),
      ),
      body: GridView.count(
  padding: const EdgeInsets.all(16),
  crossAxisCount: 2,
  crossAxisSpacing: 16,
  mainAxisSpacing: 16,
  children: [
    GestureDetector(
  onTap: () {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const BurnsPage()),
    );
  },
  child: Card(
    child: Center(child: Text('Burns')),
  ),
),

    InkWell(
  onTap: () {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const CutsPage()),
    );
  },
  child: Card(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: const [
        Icon(Icons.cut, size: 46, color: Colors.red),
        SizedBox(height: 10),
        Text(
          'Cuts',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ],
    ),
  ),
),

InkWell(
  onTap: () {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const FracturesPage()),
    );
  },
  child: Card(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: const [
        Icon(Icons.accessibility_new, size: 46, color: Colors.red),
        SizedBox(height: 10),
        Text(
          'Fractures',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ],
    ),
  ),
),

InkWell(
  onTap: () {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const CPRPage()),
    );
  },
  child: Card(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: const [
        Icon(Icons.favorite, size: 46, color: Colors.red),
        SizedBox(height: 10),
        Text(
          'CPR',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
        ),
      ],
    ),
  ),
),

  ],
)
              
    );
  }
}
