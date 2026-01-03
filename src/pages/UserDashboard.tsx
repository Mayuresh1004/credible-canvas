import { useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  FileText, 
  Shield, 
  CheckCircle2, 
  Hash, 
  Copy, 
  AlertTriangle,
  Loader2,
  X 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificateData {
  file: File;
  preview: string;
  hash: string;
  status: "idle" | "processing" | "hashed" | "verified" | "failed";
  extractedData?: {
    name: string;
    rollNumber: string;
    degree: string;
    institution: string;
    year: string;
    grade: string;
  };
}

const UserDashboard = () => {
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const generateHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const simulateOCR = async (): Promise<CertificateData["extractedData"]> => {
    // Simulated OCR extraction
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      name: "Rahul Kumar Singh",
      rollNumber: "2020BTCS1234",
      degree: "Bachelor of Technology in Computer Science",
      institution: "Birla Institute of Technology, Mesra",
      year: "2024",
      grade: "8.5 CGPA",
    };
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.includes("pdf") && !file.type.includes("image")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file.",
        variant: "destructive",
      });
      return;
    }

    const preview = file.type.includes("image") 
      ? URL.createObjectURL(file) 
      : "/placeholder.svg";

    setCertificate({
      file,
      preview,
      hash: "",
      status: "processing",
    });

    try {
      // Generate hash
      const hash = await generateHash(file);
      
      // Simulate OCR
      const extractedData = await simulateOCR();

      setCertificate((prev) => prev ? {
        ...prev,
        hash,
        status: "hashed",
        extractedData,
      } : null);

      toast({
        title: "Certificate Processed",
        description: "Hash generated and data extracted successfully.",
      });
    } catch (error) {
      setCertificate((prev) => prev ? { ...prev, status: "failed" } : null);
      toast({
        title: "Processing Failed",
        description: "Failed to process certificate. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const copyHash = () => {
    if (certificate?.hash) {
      navigator.clipboard.writeText(certificate.hash);
      toast({
        title: "Copied!",
        description: "Hash copied to clipboard.",
      });
    }
  };

  const clearCertificate = () => {
    setCertificate(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
              <Upload className="h-7 w-7 text-accent" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Upload & Hash Certificate
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Generate a secure blockchain hash for your academic certificate and verify its authenticity.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="animate-slide-up">
              <Card className="border-2 border-dashed border-border hover:border-accent/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    Certificate Upload
                  </CardTitle>
                  <CardDescription>
                    Upload your certificate in PDF, JPEG, or PNG format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!certificate ? (
                    <div
                      className={`relative p-8 rounded-xl border-2 border-dashed transition-all duration-200 ${
                        isDragging
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/30"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                    >
                      <div className="text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium mb-2">
                          Drag & drop your certificate
                        </p>
                        <p className="text-muted-foreground text-sm mb-4">
                          or click to browse
                        </p>
                        <Label htmlFor="file-upload">
                          <Button variant="hero" className="cursor-pointer" asChild>
                            <span>
                              <Upload className="h-4 w-4" />
                              Select File
                            </span>
                          </Button>
                        </Label>
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 z-10"
                          onClick={clearCertificate}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="p-4 rounded-xl bg-muted flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-accent/10">
                            <FileText className="h-8 w-8 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{certificate.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(certificate.file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <Badge
                            variant={
                              certificate.status === "processing"
                                ? "processing"
                                : certificate.status === "hashed"
                                ? "verified"
                                : certificate.status === "failed"
                                ? "flagged"
                                : "secondary"
                            }
                          >
                            {certificate.status === "processing" && (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            )}
                            {certificate.status}
                          </Badge>
                        </div>
                      </div>

                      {certificate.status === "processing" && (
                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Processing certificate...
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Hash & Details Section */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
              {/* Hash Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-accent" />
                    Blockchain Hash
                  </CardTitle>
                  <CardDescription>
                    SHA-256 hash for blockchain verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {certificate?.hash ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                          <span className="font-medium text-success">Hash Generated</span>
                        </div>
                        <p className="font-mono text-xs break-all text-muted-foreground">
                          {certificate.hash}
                        </p>
                      </div>
                      <Button variant="outline" className="w-full" onClick={copyHash}>
                        <Copy className="h-4 w-4" />
                        Copy Hash
                      </Button>
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-muted/50 text-center">
                      <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">
                        Upload a certificate to generate hash
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* OCR Extracted Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    Extracted Details
                  </CardTitle>
                  <CardDescription>
                    Data extracted using AI-powered OCR
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {certificate?.extractedData ? (
                    <div className="space-y-3">
                      {Object.entries(certificate.extractedData).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-border last:border-0"
                        >
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="font-medium text-right max-w-[60%]">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-muted/50 text-center">
                      <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">
                        No data extracted yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
