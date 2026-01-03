import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Hash,
  Building2,
  GraduationCap,
  Calendar,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  institution: string;
  degree: string;
  year: string;
  status: "verified" | "pending" | "flagged";
  certificateHash: string;
  ocrSummary: {
    name: string;
    rollNumber: string;
    degree: string;
    institution: string;
    year: string;
    grade: string;
    cgpa: string;
  };
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Rahul Kumar Singh",
    email: "rahul.singh@email.com",
    rollNumber: "2020BTCS1234",
    institution: "BIT Mesra",
    degree: "B.Tech CSE",
    year: "2024",
    status: "verified",
    certificateHash: "8a7b3c9d2e1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    ocrSummary: {
      name: "Rahul Kumar Singh",
      rollNumber: "2020BTCS1234",
      degree: "Bachelor of Technology in Computer Science and Engineering",
      institution: "Birla Institute of Technology, Mesra, Ranchi",
      year: "2024",
      grade: "First Class with Distinction",
      cgpa: "8.75",
    },
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    rollNumber: "2019BTEC5678",
    institution: "RVSCE Jamshedpur",
    degree: "B.Tech ECE",
    year: "2023",
    status: "pending",
    certificateHash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    ocrSummary: {
      name: "Priya Sharma",
      rollNumber: "2019BTEC5678",
      degree: "Bachelor of Technology in Electronics and Communication",
      institution: "RVS College of Engineering, Jamshedpur",
      year: "2023",
      grade: "First Class",
      cgpa: "7.89",
    },
  },
  {
    id: "3",
    name: "Amit Verma",
    email: "amit.verma@email.com",
    rollNumber: "2018MBA9012",
    institution: "XLRI Jamshedpur",
    degree: "MBA",
    year: "2022",
    status: "flagged",
    certificateHash: "f9e8d7c6b5a4938271605f4e3d2c1b0a9f8e7d6c5b4a3928170605f4e3d2c1b0",
    ocrSummary: {
      name: "Amit Kumar Verma",
      rollNumber: "2018MBA9012",
      degree: "Master of Business Administration",
      institution: "XLRI - Xavier School of Management",
      year: "2022",
      grade: "First Class",
      cgpa: "6.45",
    },
  },
  {
    id: "4",
    name: "Sneha Gupta",
    email: "sneha.gupta@email.com",
    rollNumber: "2021BTME3456",
    institution: "NIT Jamshedpur",
    degree: "B.Tech ME",
    year: "2025",
    status: "verified",
    certificateHash: "3f4e5d6c7b8a9012345678901234567890abcdef0123456789abcdef01234567",
    ocrSummary: {
      name: "Sneha Gupta",
      rollNumber: "2021BTME3456",
      degree: "Bachelor of Technology in Mechanical Engineering",
      institution: "National Institute of Technology, Jamshedpur",
      year: "2025",
      grade: "First Class with Distinction",
      cgpa: "9.12",
    },
  },
  {
    id: "5",
    name: "Vikram Das",
    email: "vikram.das@email.com",
    rollNumber: "2020BTEE7890",
    institution: "BIT Sindri",
    degree: "B.Tech EE",
    year: "2024",
    status: "pending",
    certificateHash: "abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yzab5678cdef9012",
    ocrSummary: {
      name: "Vikram Das",
      rollNumber: "2020BTEE7890",
      degree: "Bachelor of Technology in Electrical Engineering",
      institution: "Birla Institute of Technology, Sindri",
      year: "2024",
      grade: "First Class",
      cgpa: "7.56",
    },
  },
];

const RecruiterDashboard = () => {
  const [students] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"success" | "failed" | null>(null);
  const { toast } = useToast();

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    // Simulate blockchain verification
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const isSuccess = selectedStudent?.status !== "flagged";
    setVerificationResult(isSuccess ? "success" : "failed");
    setIsVerifying(false);

    toast({
      title: isSuccess ? "Verification Successful" : "Verification Failed",
      description: isSuccess
        ? "Certificate hash matched with blockchain record."
        : "Certificate hash mismatch detected. Possible forgery.",
      variant: isSuccess ? "default" : "destructive",
    });
  };

  const getStatusIcon = (status: Student["status"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "flagged":
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const stats = {
    total: students.length,
    verified: students.filter((s) => s.status === "verified").length,
    pending: students.filter((s) => s.status === "pending").length,
    flagged: students.filter((s) => s.status === "flagged").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        {/* Page Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Recruiter Portal
              </h1>
              <p className="text-muted-foreground text-lg">
                Verify student credentials and authenticate certificates
              </p>
            </div>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll number, or institution..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.verified}</p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-danger/10">
                  <AlertTriangle className="h-6 w-6 text-danger" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.flagged}</p>
                  <p className="text-sm text-muted-foreground">Flagged</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Student Records
            </CardTitle>
            <CardDescription>
              Click on a student to view details and verify their certificate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden md:table-cell">Roll Number</TableHead>
                    <TableHead className="hidden lg:table-cell">Institution</TableHead>
                    <TableHead className="hidden md:table-cell">Degree</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedStudent(student);
                        setVerificationResult(null);
                      }}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground md:hidden">
                            {student.rollNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-sm">
                        {student.rollNumber}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {student.institution}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{student.degree}</TableCell>
                      <TableCell>
                        <Badge variant={student.status}>
                          {getStatusIcon(student.status)}
                          <span className="ml-1 capitalize">{student.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Student Detail Dialog */}
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                Student Certificate Details
              </DialogTitle>
              <DialogDescription>
                Review extracted OCR data and verify blockchain authenticity
              </DialogDescription>
            </DialogHeader>

            {selectedStudent && (
              <div className="space-y-6 mt-4">
                {/* Student Info Header */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-accent">
                      {selectedStudent.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                    <p className="text-muted-foreground">{selectedStudent.email}</p>
                  </div>
                  <Badge variant={selectedStudent.status} className="mt-1">
                    {getStatusIcon(selectedStudent.status)}
                    <span className="ml-1 capitalize">{selectedStudent.status}</span>
                  </Badge>
                </div>

                {/* OCR Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-accent" />
                      OCR Extracted Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {Object.entries(selectedStudent.ocrSummary).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border last:border-0 gap-1"
                        >
                          <span className="text-muted-foreground capitalize text-sm">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="font-medium text-sm sm:text-right sm:max-w-[60%]">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Blockchain Verification */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Hash className="h-4 w-4 text-accent" />
                      Blockchain Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Certificate Hash</p>
                      <p className="font-mono text-xs break-all">
                        {selectedStudent.certificateHash}
                      </p>
                    </div>

                    {verificationResult && (
                      <div
                        className={`p-4 rounded-xl border ${
                          verificationResult === "success"
                            ? "bg-success/5 border-success/20"
                            : "bg-danger/5 border-danger/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {verificationResult === "success" ? (
                            <>
                              <CheckCircle2 className="h-5 w-5 text-success" />
                              <span className="font-medium text-success">
                                Blockchain Verified
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-5 w-5 text-danger" />
                              <span className="font-medium text-danger">
                                Verification Failed - Possible Forgery
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {verificationResult === "success"
                            ? "Hash matches the record stored on the blockchain. Certificate is authentic."
                            : "Hash does not match blockchain record. This certificate may be forged or tampered."}
                        </p>
                      </div>
                    )}

                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={handleVerify}
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Verifying on Blockchain...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4" />
                          Authenticate Certificate
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Institution Info */}
                <div className="flex items-center gap-3 p-4 rounded-xl border">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{selectedStudent.ocrSummary.institution}</p>
                    <p className="text-sm text-muted-foreground">Issuing Institution</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{selectedStudent.year}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
